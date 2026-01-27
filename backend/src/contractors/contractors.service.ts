import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContractorDto, UpdateContractorDto, FilterContractorDto, RateContractorDto } from './dto';
import { ContractorStatus, Prisma, ReviewEntityType } from '@prisma/client';

@Injectable()
export class ContractorsService {
  constructor(private prisma: PrismaService) {}

  // Create contractor profile
  async create(userId: string, dto: CreateContractorDto) {
    // Check if user already has a contractor profile
    const existing = await this.prisma.contractor.findUnique({
      where: { userId },
    });

    if (existing) {
      throw new BadRequestException('Contractor profile already exists');
    }

    // Check if user role is CONTRACTOR
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== 'CONTRACTOR') {
      throw new BadRequestException('User must have CONTRACTOR role');
    }

    return this.prisma.contractor.create({
      data: {
        ...dto,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            profileImageUrl: true,
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });
  }

  // Get all contractors with filters
  async findAll(filters: FilterContractorDto) {
    const {
      search,
      service,
      locationCity,
      status,
      minRating,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ContractorWhereInput = {
      // Only show verified contractors for public listing
      status: status || ContractorStatus.VERIFIED,
    };

    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { servicesOffered: { has: search } },
      ];
    }

    if (service) {
      where.servicesOffered = { has: service };
    }

    if (locationCity) {
      where.locationCity = { contains: locationCity, mode: 'insensitive' };
    }

    if (minRating !== undefined) {
      where.ratingAverage = { gte: new Prisma.Decimal(minRating) };
    }

    // Execute query
    const [contractors, total] = await Promise.all([
      this.prisma.contractor.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              profileImageUrl: true,
            },
          },
          _count: {
            select: {
              reviews: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      this.prisma.contractor.count({ where }),
    ]);

    return {
      data: contractors,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get single contractor by ID
  async findOne(id: string) {
    const contractor = await this.prisma.contractor.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            profileImageUrl: true,
          },
        },
        reviews: {
          include: {
            reviewer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImageUrl: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            reviews: true,
            verifications: true,
          },
        },
      },
    });

    if (!contractor) {
      throw new NotFoundException('Contractor not found');
    }

    return contractor;
  }

  // Get contractor by user ID
  async findByUserId(userId: string) {
    const contractor = await this.prisma.contractor.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            profileImageUrl: true,
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    if (!contractor) {
      throw new NotFoundException('Contractor profile not found');
    }

    return contractor;
  }

  // Update contractor profile
  async update(id: string, userId: string, dto: UpdateContractorDto) {
    const contractor = await this.prisma.contractor.findUnique({
      where: { id },
    });

    if (!contractor) {
      throw new NotFoundException('Contractor not found');
    }

    if (contractor.userId !== userId) {
      throw new ForbiddenException('You do not have permission to update this contractor profile');
    }

    return this.prisma.contractor.update({
      where: { id },
      data: dto,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            profileImageUrl: true,
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });
  }

  // Delete contractor profile
  async remove(id: string, userId: string) {
    const contractor = await this.prisma.contractor.findUnique({
      where: { id },
    });

    if (!contractor) {
      throw new NotFoundException('Contractor not found');
    }

    if (contractor.userId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this contractor profile');
    }

    await this.prisma.contractor.delete({
      where: { id },
    });

    return { message: 'Contractor profile deleted successfully' };
  }

  // Status Management
  async updateStatus(id: string, status: ContractorStatus) {
    return this.prisma.contractor.update({
      where: { id },
      data: { status },
    });
  }

  async verifyContractor(id: string) {
    const contractor = await this.prisma.contractor.findUnique({
      where: { id },
    });

    if (!contractor) {
      throw new NotFoundException('Contractor not found');
    }

    if (contractor.status !== ContractorStatus.PENDING) {
      throw new BadRequestException('Only pending contractors can be verified');
    }

    return this.prisma.contractor.update({
      where: { id },
      data: {
        status: ContractorStatus.VERIFIED,
        isVerified: true,
        verifiedAt: new Date(),
      },
    });
  }

  async suspendContractor(id: string) {
    return this.updateStatus(id, ContractorStatus.SUSPENDED);
  }

  // Rating System
  async rateContractor(contractorId: string, reviewerId: string, dto: RateContractorDto) {
    // Check if contractor exists
    const contractor = await this.prisma.contractor.findUnique({
      where: { id: contractorId },
    });

    if (!contractor) {
      throw new NotFoundException('Contractor not found');
    }

    // Check if user already reviewed this contractor
    const existingReview = await this.prisma.review.findFirst({
      where: {
        reviewedEntityId: contractorId,
        reviewerId,
      },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this contractor');
    }

    // Create review
    const review = await this.prisma.review.create({
      data: {
        reviewedEntityId: contractorId,
        reviewedEntityType: ReviewEntityType.CONTRACTOR,
        reviewerId,
        rating: dto.rating,
        comment: dto.comment,
      },
      include: {
        reviewer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true,
          },
        },
      },
    });

    // Update contractor rating
    await this.updateContractorRating(contractorId);

    return review;
  }

  private async updateContractorRating(contractorId: string) {
    // Get all reviews for this contractor
    const reviews = await this.prisma.review.findMany({
      where: {
        reviewedEntityId: contractorId,
      },
    });

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    // Update contractor
    await this.prisma.contractor.update({
      where: { id: contractorId },
      data: {
        ratingAverage: new Prisma.Decimal(avgRating),
        ratingCount: reviews.length,
      },
    });
  }

  // Get contractor reviews
  async getReviews(contractorId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: {
          reviewedEntityId: contractorId,
        },
        include: {
          reviewer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImageUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.review.count({
        where: {
          reviewedEntityId: contractorId,
        },
      }),
    ]);

    return {
      data: reviews,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Search by service category
  async findByService(service: string, filters?: FilterContractorDto) {
    return this.findAll({
      ...filters,
      service,
    });
  }

  // Get contractor statistics
  async getStats(contractorId: string) {
    const contractor = await this.prisma.contractor.findUnique({
      where: { id: contractorId },
      include: {
        _count: {
          select: {
            reviews: true,
            verifications: true,
          },
        },
      },
    });

    if (!contractor) {
      throw new NotFoundException('Contractor not found');
    }

    return {
      rating: {
        average: Number(contractor.ratingAverage),
        count: contractor.ratingCount,
      },
      reviews: contractor._count.reviews,
      verifications: contractor._count.verifications,
      status: contractor.status,
      isVerified: contractor.isVerified,
    };
  }
}
