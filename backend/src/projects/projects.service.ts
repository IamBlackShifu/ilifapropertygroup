import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, ProjectStatus } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  // Create project with milestones
  async createProjectWithMilestones(userId: string, dto: any) {
    const { milestones, ...projectData } = dto;

    // Validate total milestone amounts don't exceed budget
    const totalMilestoneAmount = milestones.reduce((sum: number, m: any) => sum + m.amount, 0);
    if (totalMilestoneAmount > dto.budget) {
      throw new BadRequestException('Total milestone amounts cannot exceed project budget');
    }

    // Create project with milestones in a transaction
    const project = await this.prisma.$transaction(async (tx) => {
      const newProject = await tx.project.create({
        data: {
          clientId: userId,
          projectName: projectData.projectName,
          propertyId: projectData.propertyId,
          projectType: projectData.projectType,
          description: projectData.description,
          budget: new Prisma.Decimal(projectData.budget),
          startDate: projectData.startDate ? new Date(projectData.startDate) : null,
          expectedEndDate: projectData.expectedEndDate ? new Date(projectData.expectedEndDate) : null,
          status: ProjectStatus.PLANNING,
        },
      });

      // Create milestones
      if (milestones && milestones.length > 0) {
        await tx.projectMilestone.createMany({
          data: milestones.map((m: any) => ({
            projectId: newProject.id,
            title: m.title,
            description: m.description,
            amount: new Prisma.Decimal(m.amount),
            currency: projectData.currency || 'USD',
            dueDate: m.dueDate ? new Date(m.dueDate) : null,
            order: m.order,
          })),
        });
      }

      return tx.project.findUnique({
        where: { id: newProject.id },
        include: {
          milestones: {
            orderBy: { order: 'asc' },
          },
          client: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });
    });

    return project;
  }

  // Get user's projects
  async getUserProjects(userId: string) {
    return this.prisma.project.findMany({
      where: { clientId: userId },
      include: {
        milestones: {
          orderBy: { order: 'asc' },
        },
        property: {
          select: {
            title: true,
            locationCity: true,
          },
        },
        _count: {
          select: {
            stages: true,
            milestones: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get project by ID
  async getProjectById(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        property: true,
        milestones: {
          orderBy: { order: 'asc' },
        },
        stages: {
          include: {
            contractor: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
          orderBy: { stageOrder: 'asc' },
        },
        contracts: {
          include: {
            contractor: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        inspections: {
          orderBy: { scheduledDate: 'desc' },
        },
        payments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  // Create contract
  async createContract(userId: string, dto: any) {
    // Verify project exists and user is the client
    const project = await this.prisma.project.findUnique({
      where: { id: dto.projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.clientId !== userId) {
      throw new ForbiddenException('Only project client can create contracts');
    }

    // Generate contract number
    const contractNumber = `CONT-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    const contract = await this.prisma.contract.create({
      data: {
        projectId: dto.projectId,
        contractorId: dto.contractorId,
        clientId: dto.clientId,
        contractNumber,
        title: dto.title,
        description: dto.description,
        scope: dto.scope,
        terms: dto.terms,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        totalAmount: new Prisma.Decimal(dto.totalAmount),
        currency: dto.currency || 'USD',
        status: 'DRAFT',
      },
      include: {
        project: true,
        contractor: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        client: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return contract;
  }

  // Sign contract
  async signContract(userId: string, contractId: string, signatureType: 'client' | 'contractor') {
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        project: true,
      },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    // Verify the user is authorized to sign
    if (signatureType === 'client' && contract.clientId !== userId) {
      throw new ForbiddenException('Only the client can sign on behalf of client');
    }

    if (signatureType === 'contractor' && contract.contractorId !== userId) {
      throw new ForbiddenException('Only the contractor can sign on behalf of contractor');
    }

    const updateData: any = {};

    if (signatureType === 'client') {
      if (contract.clientSigned) {
        throw new BadRequestException('Client has already signed this contract');
      }
      updateData.clientSigned = true;
      updateData.clientSignedAt = new Date();
    } else {
      if (contract.contractorSigned) {
        throw new BadRequestException('Contractor has already signed this contract');
      }
      updateData.contractorSigned = true;
      updateData.contractorSignedAt = new Date();
    }

    // If both parties have now signed, activate the contract
    const bothSigned = 
      (signatureType === 'client' && contract.contractorSigned) ||
      (signatureType === 'contractor' && contract.clientSigned);

    if (bothSigned) {
      updateData.status = 'ACTIVE';

      // Update project status to IN_PROGRESS
      await this.prisma.project.update({
        where: { id: contract.projectId },
        data: { status: ProjectStatus.IN_PROGRESS },
      });
    } else {
      updateData.status = 'PENDING_SIGNATURE';
    }

    const updated = await this.prisma.contract.update({
      where: { id: contractId },
      data: updateData,
      include: {
        project: true,
        contractor: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        client: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Send notification to the other party
    const otherPartyId = signatureType === 'client' ? contract.contractorId : contract.clientId;
    await this.prisma.notification.create({
      data: {
        userId: otherPartyId,
        type: 'INFO',
        category: 'PROJECT',
        title: bothSigned ? 'Contract Activated!' : 'Contract Awaiting Your Signature',
        message: bothSigned 
          ? `Contract "${contract.title}" is now active. Both parties have signed.`
          : `Contract "${contract.title}" has been signed by ${signatureType === 'client' ? 'the client' : 'the contractor'}. Please review and sign.`,
        linkUrl: `/contracts/${contractId}`,
      },
    });

    return updated;
  }

  // Get contract by ID
  async getContract(contractId: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        project: {
          include: {
            milestones: {
              orderBy: { order: 'asc' },
            },
          },
        },
        contractor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    return contract;
  }

  // Get user's contracts
  async getUserContracts(userId: string, role: 'client' | 'contractor') {
    const where = role === 'client' ? { clientId: userId } : { contractorId: userId };

    return this.prisma.contract.findMany({
      where,
      include: {
        project: {
          select: {
            projectName: true,
            status: true,
          },
        },
        contractor: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get project milestones
  async getProjectMilestones(projectId: string) {
    return this.prisma.projectMilestone.findMany({
      where: { projectId },
      orderBy: { order: 'asc' },
    });
  }

  // Mark milestone as completed
  async completeMilestone(milestoneId: string, userId: string) {
    const milestone = await this.prisma.projectMilestone.findUnique({
      where: { id: milestoneId },
      include: { project: true },
    });

    if (!milestone) {
      throw new NotFoundException('Milestone not found');
    }

    if (milestone.project.clientId !== userId) {
      throw new ForbiddenException('Only project client can mark milestones as completed');
    }

    return this.prisma.projectMilestone.update({
      where: { id: milestoneId },
      data: {
        completedDate: new Date(),
      },
    });
  }
}
