import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PropertyStatus, UserRole, VerificationStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // ==================== DASHBOARD STATS ====================
  async getDashboardStats() {
    const [
      totalUsers,
      totalProperties,
      pendingVerifications,
      activeProperties,
      totalRevenue,
      recentUsers,
      recentProperties,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.property.count(),
      this.prisma.verification.count({ where: { status: 'PENDING' } }),
      this.prisma.property.count({ where: { status: 'VERIFIED' } }),
      this.prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
      }),
      this.prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
      this.prisma.property.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
    ]);

    return {
      stats: {
        totalUsers,
        totalProperties,
        pendingVerifications,
        activeProperties,
        totalRevenue: totalRevenue._sum.amount || 0,
      },
      recentActivity: {
        users: recentUsers,
        properties: recentProperties,
      },
    };
  }

  // ==================== USER MANAGEMENT ====================
  async getAllUsers(params?: {
    page?: number;
    limit?: number;
    role?: UserRole;
    search?: string;
    status?: 'active' | 'suspended' | 'all';
  }) {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (params?.role) {
      where.role = params.role;
    }

    if (params?.search) {
      where.OR = [
        { email: { contains: params.search, mode: 'insensitive' } },
        { firstName: { contains: params.search, mode: 'insensitive' } },
        { lastName: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (params?.status === 'active') {
      where.isActive = true;
      where.isSuspended = false;
    } else if (params?.status === 'suspended') {
      where.isSuspended = true;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          emailVerified: true,
          isActive: true,
          isSuspended: true,
          profileImageUrl: true,
          createdAt: true,
          lastLogin: true,
          _count: {
            select: {
              properties: true,
              projects: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        properties: {
          select: {
            id: true,
            title: true,
            status: true,
            price: true,
            createdAt: true,
          },
        },
        projects: {
          select: {
            id: true,
            projectName: true,
            status: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            properties: true,
            projects: true,
            payments: true,
            reviews: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUser(userId: string, data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    role?: UserRole;
    emailVerified?: boolean;
  }) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async suspendUser(userId: string, reason?: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === 'ADMIN') {
      throw new BadRequestException('Cannot suspend admin users');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { isSuspended: true, isActive: false },
    });
  }

  async activateUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { isSuspended: false, isActive: true },
    });
  }

  async deleteUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === 'ADMIN') {
      throw new BadRequestException('Cannot delete admin users');
    }

    // Delete user and all related data (cascade)
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }

  // ==================== PROPERTY MANAGEMENT ====================
  async getAllProperties(params?: {
    page?: number;
    limit?: number;
    status?: PropertyStatus;
    search?: string;
  }) {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (params?.status) {
      where.status = params.status;
    }

    if (params?.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
        { location: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [properties, total] = await Promise.all([
      this.prisma.property.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          verifications: {
            where: { entityType: 'PROPERTY' },
            orderBy: { submittedAt: 'desc' },
            take: 1,
          },
        },
      }),
      this.prisma.property.count({ where }),
    ]);

    return {
      properties,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateProperty(propertyId: string, data: any) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    return this.prisma.property.update({
      where: { id: propertyId },
      data,
    });
  }

  async deleteProperty(propertyId: string) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    return this.prisma.property.delete({
      where: { id: propertyId },
    });
  }

  async approveProperty(propertyId: string, adminId: string) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    // Update property status to VERIFIED
    await this.prisma.property.update({
      where: { id: propertyId },
      data: { status: 'VERIFIED' },
    });

    // Find pending verification for this property
    const verification = await this.prisma.verification.findFirst({
      where: {
        entityId: propertyId,
        entityType: 'PROPERTY',
        status: 'PENDING',
      },
    });

    if (verification) {
      // Update verification status
      await this.prisma.verification.update({
        where: { id: verification.id },
        data: {
          status: 'APPROVED',
          reviewedBy: adminId,
          reviewedAt: new Date(),
        },
      });
    }

    return { message: 'Property approved successfully' };
  }

  async rejectProperty(
    propertyId: string,
    adminId: string,
    rejectionReason: string,
  ) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    // Update property status back to DRAFT
    await this.prisma.property.update({
      where: { id: propertyId },
      data: { status: 'DRAFT' },
    });

    // Find pending verification for this property
    const verification = await this.prisma.verification.findFirst({
      where: {
        entityId: propertyId,
        entityType: 'PROPERTY',
        status: 'PENDING',
      },
    });

    if (verification) {
      // Update verification status
      await this.prisma.verification.update({
        where: { id: verification.id },
        data: {
          status: 'REJECTED',
          reviewedBy: adminId,
          reviewedAt: new Date(),
          reviewNotes: rejectionReason,
        },
      });
    }

    return { message: 'Property rejected' };
  }

  // ==================== VERIFICATION MANAGEMENT ====================
  async getPendingVerifications(params?: {
    page?: number;
    limit?: number;
    entityType?: 'PROPERTY' | 'CONTRACTOR' | 'SUPPLIER' | 'USER';
  }) {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      status: 'PENDING',
    };

    if (params?.entityType) {
      where.entityType = params.entityType;
    }

    const [verifications, total] = await Promise.all([
      this.prisma.verification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { submittedAt: 'desc' },
        include: {
          submitter: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          documents: true,
        },
      }),
      this.prisma.verification.count({ where }),
    ]);

    return {
      verifications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async approveVerification(verificationId: string, adminId: string) {
    const verification = await this.prisma.verification.findUnique({
      where: { id: verificationId },
    });

    if (!verification) {
      throw new NotFoundException('Verification not found');
    }

    // Update verification
    await this.prisma.verification.update({
      where: { id: verificationId },
      data: {
        status: 'APPROVED',
        reviewedBy: adminId,
        reviewedAt: new Date(),
      },
    });

    // Update related entity status if it's a property
    if (verification.entityType === 'PROPERTY') {
      await this.prisma.property.update({
        where: { id: verification.entityId },
        data: { status: 'VERIFIED' },
      });
    }

    return { message: 'Verification approved' };
  }

  async rejectVerification(
    verificationId: string,
    adminId: string,
    rejectionReason: string,
  ) {
    const verification = await this.prisma.verification.findUnique({
      where: { id: verificationId },
    });

    if (!verification) {
      throw new NotFoundException('Verification not found');
    }

    // Update verification
    await this.prisma.verification.update({
      where: { id: verificationId },
      data: {
        status: 'REJECTED',
        reviewedBy: adminId,
        reviewedAt: new Date(),
        reviewNotes: rejectionReason,
      },
    });

    // Update related entity status if it's a property
    if (verification.entityType === 'PROPERTY') {
      await this.prisma.property.update({
        where: { id: verification.entityId },
        data: { status: 'DRAFT' },
      });
    }

    return { message: 'Verification rejected' };
  }

  // ==================== SUPPLIER MANAGEMENT ====================
  async getAllSuppliers(params?: {
    page?: number;
    limit?: number;
    status?: 'PENDING' | 'VERIFIED' | 'SUSPENDED';
    search?: string;
  }) {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (params?.status) {
      where.status = params.status;
    }

    if (params?.search) {
      where.OR = [
        { companyName: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
        { location: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [suppliers, total] = await Promise.all([
      this.prisma.supplier.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          _count: {
            select: {
              products: true,
              orders: true,
            },
          },
        },
      }),
      this.prisma.supplier.count({ where }),
    ]);

    return {
      suppliers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getSupplierById(supplierId: string) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id: supplierId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            profileImageUrl: true,
            createdAt: true,
          },
        },
        products: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        orders: {
          take: 10,
          orderBy: { orderDate: 'desc' },
        },
        _count: {
          select: {
            products: true,
            orders: true,
          },
        },
      },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    return supplier;
  }

  async verifySupplier(supplierId: string, adminId: string) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id: supplierId },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    if (supplier.status === 'VERIFIED') {
      throw new BadRequestException('Supplier is already verified');
    }

    return this.prisma.supplier.update({
      where: { id: supplierId },
      data: {
        status: 'VERIFIED',
        verifiedAt: new Date(),
      },
    });
  }

  async rejectSupplier(
    supplierId: string,
    adminId: string,
    rejectionReason: string,
  ) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id: supplierId },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    // Could send notification to supplier here with rejection reason
    return this.prisma.supplier.update({
      where: { id: supplierId },
      data: {
        status: 'PENDING',
        // Store rejection reason in a notification or separate table
      },
    });
  }

  async suspendSupplier(supplierId: string, reason?: string) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id: supplierId },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    return this.prisma.supplier.update({
      where: { id: supplierId },
      data: {
        status: 'SUSPENDED',
      },
    });
  }

  async activateSupplier(supplierId: string) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id: supplierId },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    return this.prisma.supplier.update({
      where: { id: supplierId },
      data: {
        status: 'VERIFIED',
      },
    });
  }

  // ==================== CONTRACTOR MANAGEMENT ====================
  async getAllContractors(params?: {
    page?: number;
    limit?: number;
    status?: 'PENDING' | 'VERIFIED' | 'SUSPENDED' | 'INCOMPLETE';
    search?: string;
  }) {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const skip = (page - 1) * limit;

    // If filtering for INCOMPLETE status, only return incomplete profiles
    if (params?.status === 'INCOMPLETE') {
      const incompleteContractors = await this.prisma.user.findMany({
        where: {
          role: 'CONTRACTOR',
          contractor: null,
          ...(params?.search && {
            OR: [
              { firstName: { contains: params.search, mode: 'insensitive' } },
              { lastName: { contains: params.search, mode: 'insensitive' } },
              { email: { contains: params.search, mode: 'insensitive' } },
            ],
          }),
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          createdAt: true,
        },
      });

      const total = await this.prisma.user.count({
        where: {
          role: 'CONTRACTOR',
          contractor: null,
        },
      });

      const incompleteFormatted = incompleteContractors.map(user => ({
        id: null,
        userId: user.id,
        companyName: null,
        description: null,
        locationCity: null,
        yearsExperience: null,
        employeesCount: null,
        status: 'INCOMPLETE' as const,
        isVerified: false,
        verifiedAt: null,
        ratingAverage: '0',
        ratingCount: 0,
        createdAt: user.createdAt,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
        _count: {
          stages: 0,
          reviews: 0,
        },
      }));

      return {
        contractors: incompleteFormatted,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    }

    const where: any = {};

    if (params?.status) {
      where.status = params.status;
    }

    if (params?.search) {
      where.OR = [
        { companyName: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
        { locationCity: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [contractors, total] = await Promise.all([
      this.prisma.contractor.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          _count: {
            select: {
              stages: true,
              reviews: true,
            },
          },
        },
      }),
      this.prisma.contractor.count({ where }),
    ]);

    // Also get users with CONTRACTOR role but no profile
    const incompleteContractors = await this.prisma.user.findMany({
      where: {
        role: 'CONTRACTOR',
        contractor: null,
        ...(params?.search && {
          OR: [
            { firstName: { contains: params.search, mode: 'insensitive' } },
            { lastName: { contains: params.search, mode: 'insensitive' } },
            { email: { contains: params.search, mode: 'insensitive' } },
          ],
        }),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    });

    // Transform incomplete contractors to match the format
    const incompleteFormatted = incompleteContractors.map(user => ({
      id: null, // No contractor ID yet
      userId: user.id,
      companyName: null,
      description: null,
      locationCity: null,
      yearsExperience: null,
      employeesCount: null,
      status: 'INCOMPLETE' as const,
      isVerified: false,
      verifiedAt: null,
      ratingAverage: '0',
      ratingCount: 0,
      createdAt: user.createdAt,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
      _count: {
        stages: 0,
        reviews: 0,
      },
    }));

    // Combine and sort by createdAt
    const allContractors = [...contractors, ...incompleteFormatted].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return {
      contractors: allContractors,
      pagination: {
        total: total + incompleteContractors.length,
        page,
        limit,
        totalPages: Math.ceil((total + incompleteContractors.length) / limit),
      },
    };
  }

  async getContractorById(contractorId: string) {
    const contractor = await this.prisma.contractor.findUnique({
      where: { id: contractorId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            profileImageUrl: true,
            createdAt: true,
          },
        },
        services: {
          include: {
            service: true,
          },
        },
        stages: {
          take: 10,
          orderBy: { stageOrder: 'desc' },
          include: {
            project: {
              select: {
                id: true,
                projectName: true,
                status: true,
              },
            },
          },
        },
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            reviewer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        _count: {
          select: {
            stages: true,
            reviews: true,
          },
        },
      },
    });

    if (!contractor) {
      throw new NotFoundException('Contractor not found');
    }

    return contractor;
  }

  async verifyContractor(contractorId: string, adminId: string) {
    const contractor = await this.prisma.contractor.findUnique({
      where: { id: contractorId },
    });

    if (!contractor) {
      throw new NotFoundException('Contractor not found');
    }

    if (contractor.status === 'VERIFIED') {
      throw new BadRequestException('Contractor is already verified');
    }

    return this.prisma.contractor.update({
      where: { id: contractorId },
      data: {
        status: 'VERIFIED',
        isVerified: true,
        verifiedAt: new Date(),
      },
    });
  }

  async rejectContractor(
    contractorId: string,
    adminId: string,
    rejectionReason: string,
  ) {
    const contractor = await this.prisma.contractor.findUnique({
      where: { id: contractorId },
    });

    if (!contractor) {
      throw new NotFoundException('Contractor not found');
    }

    // Store rejection reason in a notification or separate table
    return this.prisma.contractor.update({
      where: { id: contractorId },
      data: {
        status: 'PENDING',
        isVerified: false,
      },
    });
  }

  async suspendContractorAccount(contractorId: string, reason?: string) {
    const contractor = await this.prisma.contractor.findUnique({
      where: { id: contractorId },
    });

    if (!contractor) {
      throw new NotFoundException('Contractor not found');
    }

    return this.prisma.contractor.update({
      where: { id: contractorId },
      data: {
        status: 'SUSPENDED',
      },
    });
  }

  async activateContractor(contractorId: string) {
    const contractor = await this.prisma.contractor.findUnique({
      where: { id: contractorId },
    });

    if (!contractor) {
      throw new NotFoundException('Contractor not found');
    }

    return this.prisma.contractor.update({
      where: { id: contractorId },
      data: {
        status: 'VERIFIED',
        isVerified: true,
      },
    });
  }

  // ==================== SUBSCRIPTION & PAYMENT MANAGEMENT ====================
  async getAllSubscriptions(params?: {
    page?: number;
    limit?: number;
    status?: string;
    plan?: string;
  }) {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (params?.status) {
      where.status = params.status;
    }

    if (params?.plan) {
      where.plan = params.plan;
    }

    const [subscriptions, total] = await Promise.all([
      this.prisma.subscription.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
            },
          },
        },
      }),
      this.prisma.subscription.count({ where }),
    ]);

    return {
      subscriptions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getSubscriptionStats() {
    const [
      totalSubscriptions,
      activeSubscriptions,
      expiredSubscriptions,
      totalRevenue,
      planCounts,
    ] = await Promise.all([
      this.prisma.subscription.count(),
      this.prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      this.prisma.subscription.count({ where: { status: 'EXPIRED' } }),
      this.prisma.subscription.aggregate({
        where: { status: 'ACTIVE' },
        _sum: { amount: true },
      }),
      this.prisma.subscription.groupBy({
        by: ['plan'],
        _count: true,
      }),
    ]);

    return {
      totalSubscriptions,
      activeSubscriptions,
      expiredSubscriptions,
      totalRevenue: totalRevenue._sum.amount || 0,
      planDistribution: planCounts,
    };
  }

  async getAllPayments(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (params?.status) {
      where.status = params.status;
    }

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          payer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.payment.count({ where }),
    ]);

    return {
      payments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPaymentStats() {
    const [
      totalPayments,
      completedPayments,
      pendingPayments,
      totalAmount,
      recentPayments,
    ] = await Promise.all([
      this.prisma.payment.count(),
      this.prisma.payment.count({ where: { status: 'COMPLETED' } }),
      this.prisma.payment.count({ where: { status: 'PENDING' } }),
      this.prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
      }),
      this.prisma.payment.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          payer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
    ]);

    return {
      totalPayments,
      completedPayments,
      pendingPayments,
      totalAmount: totalAmount._sum.amount || 0,
      recentPayments,
    };
  }

  // ==================== ADVANCED ANALYTICS ====================

  // Platform Overview Analytics
  async getPlatformAnalytics(startDate?: Date, endDate?: Date) {
    const dateFilter = startDate && endDate ? {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    } : {};

    const [
      userStats,
      propertyStats,
      orderStats,
      paymentStats,
      verificationStats,
      projectStats,
    ] = await Promise.all([
      // User statistics
      this.prisma.user.groupBy({
        by: ['role'],
        where: dateFilter,
        _count: { id: true },
      }),
      // Property statistics
      this.prisma.property.groupBy({
        by: ['status', 'propertyType'],
        where: dateFilter,
        _count: { id: true },
        _avg: { price: true },
      }),
      // Order statistics - simplified to avoid TypeScript circular reference
      Promise.all([
        this.prisma.order.count({ where: { ...dateFilter, status: 'PENDING' } }),
        this.prisma.order.count({ where: { ...dateFilter, status: 'CONFIRMED' } }),
        this.prisma.order.count({ where: { ...dateFilter, status: 'DELIVERED' } }),
        this.prisma.order.aggregate({
          where: { ...dateFilter, status: 'DELIVERED' },
          _sum: { totalAmount: true },
        }),
      ]).then(([pending, confirmed, delivered, revenue]) => [{
        status: 'PENDING',
        _count: { id: pending },
        _sum: { totalAmount: 0 },
      }, {
        status: 'CONFIRMED',
        _count: { id: confirmed },
        _sum: { totalAmount: 0 },
      }, {
        status: 'DELIVERED',
        _count: { id: delivered },
        _sum: { totalAmount: revenue._sum.totalAmount || 0 },
      }]),
      // Payment statistics
      this.prisma.payment.groupBy({
        by: ['status', 'paymentMethod'],
        where: dateFilter,
        _count: { id: true },
        _sum: { amount: true },
      }),
      // Verification statistics - simplified to avoid TypeScript circular reference
      Promise.all([
        this.prisma.verification.findMany({
          where: {
            ...(startDate && endDate ? {
              submittedAt: {
                gte: startDate,
                lte: endDate,
              },
            } : {}),
          },
          select: { status: true, entityType: true },
        }),
      ]).then(([verifications]) => {
        const grouped = verifications.reduce((acc, v) => {
          const key = `${v.status}_${v.entityType}`;
          if (!acc[key]) {
            acc[key] = { status: v.status, entityType: v.entityType, _count: { id: 0 } };
          }
          acc[key]._count.id++;
          return acc;
        }, {} as Record<string, any>);
        return Object.values(grouped);
      }),
      // Project statistics
      this.prisma.project.groupBy({
        by: ['status', 'projectType'],
        where: dateFilter,
        _count: { id: true },
        _sum: { budget: true },
      }),
    ]);

    return {
      period: {
        startDate,
        endDate,
      },
      users: {
        byRole: userStats,
        total: userStats.reduce((sum, stat) => sum + stat._count.id, 0),
      },
      properties: {
        byStatus: propertyStats.reduce((acc, stat) => {
          if (!acc[stat.status]) acc[stat.status] = 0;
          acc[stat.status] += stat._count.id;
          return acc;
        }, {}),
        byType: propertyStats.reduce((acc, stat) => {
          if (!acc[stat.propertyType]) acc[stat.propertyType] = { count: 0, avgPrice: 0 };
          acc[stat.propertyType].count += stat._count.id;
          acc[stat.propertyType].avgPrice = Number(stat._avg.price) || 0;
          return acc;
        }, {}),
        total: propertyStats.reduce((sum, stat) => sum + stat._count.id, 0),
      },
      orders: {
        byStatus: orderStats,
        totalOrders: orderStats.reduce((sum, stat) => sum + stat._count.id, 0),
        totalRevenue: orderStats.reduce((sum, stat) => sum + Number(stat._sum.totalAmount || 0), 0),
      },
      payments: {
        byStatus: paymentStats,
        byMethod: paymentStats.reduce((acc, stat) => {
          if (!acc[stat.paymentMethod]) acc[stat.paymentMethod] = { count: 0, amount: 0 };
          acc[stat.paymentMethod].count += stat._count.id;
          acc[stat.paymentMethod].amount += Number(stat._sum.amount || 0);
          return acc;
        }, {}),
        totalPayments: paymentStats.reduce((sum, stat) => sum + stat._count.id, 0),
        totalAmount: paymentStats.reduce((sum, stat) => sum + Number(stat._sum.amount || 0), 0),
      },
      verifications: {
        byStatus: verificationStats,
        byEntityType: verificationStats.reduce((acc, stat) => {
          if (!acc[stat.entityType]) acc[stat.entityType] = {};
          acc[stat.entityType][stat.status] = stat._count.id;
          return acc;
        }, {}),
      },
      projects: {
        byStatus: projectStats,
        byType: projectStats.reduce((acc, stat) => {
          if (!acc[stat.projectType]) acc[stat.projectType] = { count: 0, totalBudget: 0 };
          acc[stat.projectType].count += stat._count.id;
          acc[stat.projectType].totalBudget += Number(stat._sum.budget || 0);
          return acc;
        }, {}),
        totalProjects: projectStats.reduce((sum, stat) => sum + stat._count.id, 0),
      },
    };
  }

  // Revenue Analytics
  async getRevenueAnalytics(period: 'daily' | 'weekly' | 'monthly' = 'monthly', months: number = 12) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const payments = await this.prisma.payment.findMany({
      where: {
        status: 'COMPLETED',
        completedAt: {
          gte: startDate,
        },
      },
      select: {
        amount: true,
        completedAt: true,
        paymentMethod: true,
        relatedEntityType: true,
      },
      orderBy: {
        completedAt: 'asc',
      },
    });

    // Group by period
    const revenueByPeriod: { [key: string]: number } = {};
    const revenueByMethod: { [key: string]: number } = {};
    const revenueByType: { [key: string]: number } = {};

    payments.forEach(payment => {
      const date = new Date(payment.completedAt);
      let periodKey: string;

      if (period === 'daily') {
        periodKey = date.toISOString().split('T')[0];
      } else if (period === 'weekly') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        periodKey = weekStart.toISOString().split('T')[0];
      } else {
        periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }

      const amount = Number(payment.amount);
      revenueByPeriod[periodKey] = (revenueByPeriod[periodKey] || 0) + amount;
      revenueByMethod[payment.paymentMethod] = (revenueByMethod[payment.paymentMethod] || 0) + amount;
      revenueByType[payment.relatedEntityType] = (revenueByType[payment.relatedEntityType] || 0) + amount;
    });

    const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const averageTransaction = payments.length > 0 ? totalRevenue / payments.length : 0;

    return {
      period,
      months,
      totalRevenue,
      totalTransactions: payments.length,
      averageTransaction,
      revenueByPeriod,
      revenueByMethod,
      revenueByType,
    };
  }

  // User Growth Analytics
  async getUserGrowthAnalytics(months: number = 12) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const users = await this.prisma.user.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        role: true,
        createdAt: true,
        isActive: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const growthByMonth: { [key: string]: { [role: string]: number } } = {};
    const activeVsInactive = { active: 0, inactive: 0 };

    users.forEach(user => {
      const monthKey = `${user.createdAt.getFullYear()}-${String(user.createdAt.getMonth() + 1).padStart(2, '0')}`;
      if (!growthByMonth[monthKey]) {
        growthByMonth[monthKey] = {};
      }
      growthByMonth[monthKey][user.role] = (growthByMonth[monthKey][user.role] || 0) + 1;

      if (user.isActive) {
        activeVsInactive.active++;
      } else {
        activeVsInactive.inactive++;
      }
    });

    return {
      months,
      totalNewUsers: users.length,
      growthByMonth,
      activeVsInactive,
      retentionRate: users.length > 0 ? (activeVsInactive.active / users.length) * 100 : 0,
    };
  }

  // Supplier Performance Analytics
  async getSupplierPerformanceAnalytics() {
    const suppliers = await this.prisma.supplier.findMany({
      where: {
        status: 'VERIFIED',
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        _count: {
          select: {
            products: true,
            orders: true,
            reviews: true,
          },
        },
      },
    });

    const performanceData = await Promise.all(
      suppliers.map(async (supplier) => {
        const [totalRevenue, completedOrders, avgDeliveryTime] = await Promise.all([
          this.prisma.order.aggregate({
            where: {
              supplierId: supplier.id,
              status: 'DELIVERED',
            },
            _sum: { totalAmount: true },
          }),
          this.prisma.order.count({
            where: {
              supplierId: supplier.id,
              status: 'DELIVERED',
            },
          }),
          this.prisma.order.findMany({
            where: {
              supplierId: supplier.id,
              status: 'DELIVERED',
              deliveredAt: { not: null },
            },
            select: {
              orderDate: true,
              deliveredAt: true,
            },
          }),
        ]);

        const avgDays = avgDeliveryTime.length > 0
          ? avgDeliveryTime.reduce((sum, order) => {
              const days = Math.floor(
                (new Date(order.deliveredAt).getTime() - new Date(order.orderDate).getTime()) /
                (1000 * 60 * 60 * 24),
              );
              return sum + days;
            }, 0) / avgDeliveryTime.length
          : 0;

        return {
          id: supplier.id,
          name: supplier.companyName,
          ownerName: `${supplier.user.firstName} ${supplier.user.lastName}`,
          email: supplier.user.email,
          rating: Number(supplier.ratingAverage),
          reviewCount: supplier._count.reviews,
          productCount: supplier._count.products,
          totalOrders: supplier._count.orders,
          completedOrders,
          totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
          avgDeliveryDays: Math.round(avgDays),
          fulfillmentRate: supplier._count.orders > 0
            ? (completedOrders / supplier._count.orders) * 100
            : 0,
        };
      }),
    );

    // Sort by revenue
    performanceData.sort((a, b) => b.totalRevenue - a.totalRevenue);

    return {
      totalSuppliers: suppliers.length,
      topSuppliers: performanceData.slice(0, 10),
      averageRating: suppliers.reduce((sum, s) => sum + Number(s.ratingAverage), 0) / suppliers.length,
      totalRevenue: performanceData.reduce((sum, s) => sum + s.totalRevenue, 0),
    };
  }

  // Contractor Performance Analytics
  async getContractorPerformanceAnalytics() {
    const contractors = await this.prisma.contractor.findMany({
      where: {
        isVerified: true,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        _count: {
          select: {
            serviceRequests: true,
            reviews: true,
            stages: true,
          },
        },
      },
    });

    const performanceData = contractors.map(contractor => {
      const completedRequests = contractor._count.serviceRequests; // You'd filter by status in real implementation

      return {
        id: contractor.id,
        name: contractor.companyName,
        ownerName: `${contractor.user.firstName} ${contractor.user.lastName}`,
        email: contractor.user.email,
        rating: Number(contractor.ratingAverage),
        reviewCount: contractor._count.reviews,
        services: contractor.servicesOffered,
        yearsExperience: contractor.yearsExperience,
        totalServiceRequests: contractor._count.serviceRequests,
        completedProjects: contractor._count.stages,
        status: contractor.status,
      };
    });

    // Sort by rating
    performanceData.sort((a, b) => b.rating - a.rating);

    return {
      totalContractors: contractors.length,
      verifiedContractors: contractors.filter(c => c.isVerified).length,
      topContractors: performanceData.slice(0, 10),
      averageRating: contractors.reduce((sum, c) => sum + Number(c.ratingAverage), 0) / contractors.length,
      byService: contractors.reduce((acc, c) => {
        c.servicesOffered.forEach(service => {
          acc[service] = (acc[service] || 0) + 1;
        });
        return acc;
      }, {}),
    };
  }

  // Property Market Analytics
  async getPropertyMarketAnalytics() {
    const [
      propertiesByType,
      propertiesByCity,
      priceRanges,
      verificationStats,
      recentActivity,
    ] = await Promise.all([
      this.prisma.property.groupBy({
        by: ['propertyType'],
        _count: { id: true },
        _avg: { price: true },
        _min: { price: true },
        _max: { price: true },
      }),
      this.prisma.property.groupBy({
        by: ['locationCity'],
        _count: { id: true },
        _avg: { price: true },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
        take: 10,
      }),
      this.prisma.property.groupBy({
        by: ['propertyType'],
        where: {
          status: 'VERIFIED',
        },
        _count: { id: true },
      }),
      this.prisma.property.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      this.prisma.property.findMany({
        take: 10,
        orderBy: { viewCount: 'desc' },
        select: {
          id: true,
          title: true,
          propertyType: true,
          price: true,
          viewCount: true,
          locationCity: true,
        },
      }),
    ]);

    return {
      byType: propertiesByType.map(p => ({
        type: p.propertyType,
        count: p._count.id,
        avgPrice: Number(p._avg.price || 0),
        minPrice: Number(p._min.price || 0),
        maxPrice: Number(p._max.price || 0),
      })),
      byCity: propertiesByCity.map(p => ({
        city: p.locationCity,
        count: p._count.id,
        avgPrice: Number(p._avg.price || 0),
      })),
      byStatus: verificationStats.map(p => ({
        status: p.status,
        count: p._count.id,
      })),
      mostViewed: recentActivity,
      totalProperties: propertiesByType.reduce((sum, p) => sum + p._count.id, 0),
    };
  }

  // Export analytics data (for CSV/Excel)
  async exportAnalyticsData(reportType: string, startDate?: Date, endDate?: Date) {
    let data;

    switch (reportType) {
      case 'platform':
        data = await this.getPlatformAnalytics(startDate, endDate);
        break;
      case 'revenue':
        data = await this.getRevenueAnalytics();
        break;
      case 'users':
        data = await this.getUserGrowthAnalytics();
        break;
      case 'suppliers':
        data = await this.getSupplierPerformanceAnalytics();
        break;
      case 'contractors':
        data = await this.getContractorPerformanceAnalytics();
        break;
      case 'properties':
        data = await this.getPropertyMarketAnalytics();
        break;
      default:
        throw new BadRequestException('Invalid report type');
    }

    return {
      reportType,
      generatedAt: new Date(),
      period: { startDate, endDate },
      data,
    };
  }
}
