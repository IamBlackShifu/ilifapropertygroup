import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceRequestDto, UpdateServiceRequestDto } from './dto/service-request.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async createRequest(userId: string, dto: CreateServiceRequestDto) {
    // Verify contractor exists
    const contractor = await this.prisma.contractor.findUnique({
      where: { id: dto.contractorId },
    });

    if (!contractor) {
      throw new NotFoundException('Contractor not found');
    }

    // Verify property if provided
    if (dto.propertyId) {
      const property = await this.prisma.property.findUnique({
        where: { id: dto.propertyId },
      });

      if (!property) {
        throw new NotFoundException('Property not found');
      }
    }

    const request = await this.prisma.serviceRequest.create({
      data: {
        requesterId: userId,
        contractorId: dto.contractorId,
        propertyId: dto.propertyId,
        serviceType: dto.serviceType,
        description: dto.description,
        urgency: dto.urgency || 'NORMAL',
        preferredDate: dto.preferredDate ? new Date(dto.preferredDate) : null,
        locationCity: dto.locationCity,
        locationAddress: dto.locationAddress,
        estimatedBudget: dto.estimatedBudget,
      },
      include: {
        requester: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        contractor: {
          select: {
            id: true,
            companyName: true,
            user: {
              select: {
                email: true,
                phone: true,
              },
            },
          },
        },
        property: true,
      },
    });

    // Create notification for contractor
    await this.prisma.notification.create({
      data: {
        userId: contractor.userId,
        type: 'INFO',
        category: 'SYSTEM',
        title: 'New Service Request',
        message: `You have received a new service request for ${dto.serviceType}`,
        linkUrl: `/dashboard/services/${request.id}`,
      },
    });

    return request;
  }

  async getMyRequests(userId: string, filters: any = {}) {
    const { status, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where: any = { requesterId: userId };
    if (status) where.status = status;

    const [requests, total] = await Promise.all([
      this.prisma.serviceRequest.findMany({
        where,
        include: {
          contractor: {
            select: {
              id: true,
              companyName: true,
              locationCity: true,
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                  phone: true,
                },
              },
            },
          },
          property: {
            select: {
              id: true,
              title: true,
              locationCity: true,
            },
          },
        },
        orderBy: { requestedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.serviceRequest.count({ where }),
    ]);

    return {
      data: requests,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getContractorRequests(contractorId: string, filters: any = {}) {
    const { status, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where: any = { contractorId };
    if (status) where.status = status;

    const [requests, total] = await Promise.all([
      this.prisma.serviceRequest.findMany({
        where,
        include: {
          requester: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          property: {
            select: {
              id: true,
              title: true,
              locationCity: true,
            },
          },
        },
        orderBy: { requestedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.serviceRequest.count({ where }),
    ]);

    return {
      data: requests,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getRequestById(id: string, userId: string) {
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id },
      include: {
        requester: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        contractor: {
          select: {
            id: true,
            companyName: true,
            locationCity: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        property: true,
      },
    });

    if (!request) {
      throw new NotFoundException('Service request not found');
    }

    // Check if user has access
    const contractor = await this.prisma.contractor.findUnique({
      where: { id: request.contractorId },
    });

    if (request.requesterId !== userId && contractor?.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return request;
  }

  async updateRequest(id: string, userId: string, dto: UpdateServiceRequestDto) {
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id },
      include: {
        contractor: true,
        requester: true,
      },
    });

    if (!request) {
      throw new NotFoundException('Service request not found');
    }

    // Check if user is the contractor
    if (request.contractor.userId !== userId) {
      throw new ForbiddenException('Only the contractor can update this request');
    }

    const updateData: any = {
      respondedAt: dto.status ? new Date() : undefined,
      completedAt: dto.status === 'COMPLETED' ? new Date() : undefined,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      completedDate: dto.completedDate ? new Date(dto.completedDate) : undefined,
    };
    if (dto.status) updateData.status = dto.status;
    if (dto.quotedAmount !== undefined) updateData.quotedAmount = dto.quotedAmount;
    if (dto.contractorNotes) updateData.contractorNotes = dto.contractorNotes;
    if (dto.rejectionReason) updateData.rejectionReason = dto.rejectionReason;

    const updated = await this.prisma.serviceRequest.update({
      where: { id },
      data: updateData,
      include: {
        requester: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        contractor: {
          select: {
            id: true,
            companyName: true,
          },
        },
      },
    });

    // Create notification for requester
    let notificationMessage = '';
    if (dto.status === 'ACCEPTED') {
      notificationMessage = `Your service request has been accepted by ${request.contractor.companyName}`;
    } else if (dto.status === 'REJECTED') {
      notificationMessage = `Your service request has been rejected by ${request.contractor.companyName}`;
    } else if (dto.status === 'COMPLETED') {
      notificationMessage = `Your service request has been completed by ${request.contractor.companyName}`;
    }

    if (notificationMessage) {
      await this.prisma.notification.create({
        data: {
          userId: request.requesterId,
          type: dto.status === 'REJECTED' ? 'WARNING' : 'SUCCESS',
          category: 'SYSTEM',
          title: 'Service Request Update',
          message: notificationMessage,
          linkUrl: `/dashboard/services/${id}`,
        },
      });
    }

    return updated;
  }

  async cancelRequest(id: string, userId: string) {
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Service request not found');
    }

    if (request.requesterId !== userId) {
      throw new ForbiddenException('Only the requester can cancel this request');
    }

    return this.prisma.serviceRequest.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }
}
