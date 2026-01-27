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
}
