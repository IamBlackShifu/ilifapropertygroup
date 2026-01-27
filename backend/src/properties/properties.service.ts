import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePropertyDto, UpdatePropertyDto, FilterPropertyDto } from './dto';
import { PropertyStatus, Prisma, ViewingStatus } from '@prisma/client';
import { SavePropertyDto } from './dto/save-property.dto';
import { ScheduleViewingDto } from './dto/schedule-viewing.dto';
import { ContactOwnerDto } from './dto/contact-owner.dto';

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreatePropertyDto) {
    const { images, ...propertyData } = dto;

    // Create property with DRAFT status (not active until admin approves)
    const property = await this.prisma.property.create({
      data: {
        ...propertyData,
        ownerId: userId,
        price: new Prisma.Decimal(dto.price),
        sizeSqm: dto.sizeSqm ? new Prisma.Decimal(dto.sizeSqm) : null,
        coordinatesLat: dto.coordinatesLat ? new Prisma.Decimal(dto.coordinatesLat) : null,
        coordinatesLng: dto.coordinatesLng ? new Prisma.Decimal(dto.coordinatesLng) : null,
        status: PropertyStatus.DRAFT, // Always start as DRAFT
        isVerified: false,
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            profileImageUrl: true,
          },
        },
        images: true,
      },
    });

    // Add images if provided
    if (images && images.length > 0) {
      await this.prisma.propertyImage.createMany({
        data: images.map((url, index) => ({
          propertyId: property.id,
          imageUrl: url,
          isPrimary: index === 0,
          displayOrder: index,
        })),
      });

      // Fetch the property again with images
      return this.findOne(property.id);
    }

    return property;
  }

  async findAll(filters: FilterPropertyDto) {
    const {
      search,
      propertyType,
      status,
      locationCity,
      locationArea,
      minPrice,
      maxPrice,
      minBedrooms,
      maxBedrooms,
      minBathrooms,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.PropertyWhereInput = {
      // Only show verified properties for public listing
      status: status || PropertyStatus.VERIFIED,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { locationCity: { contains: search, mode: 'insensitive' } },
        { locationArea: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (propertyType) {
      where.propertyType = propertyType;
    }

    if (locationCity) {
      where.locationCity = { contains: locationCity, mode: 'insensitive' };
    }

    if (locationArea) {
      where.locationArea = { contains: locationArea, mode: 'insensitive' };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = new Prisma.Decimal(minPrice);
      }
      if (maxPrice !== undefined) {
        where.price.lte = new Prisma.Decimal(maxPrice);
      }
    }

    if (minBedrooms !== undefined || maxBedrooms !== undefined) {
      where.bedrooms = {};
      if (minBedrooms !== undefined) {
        where.bedrooms.gte = minBedrooms;
      }
      if (maxBedrooms !== undefined) {
        where.bedrooms.lte = maxBedrooms;
      }
    }

    if (minBathrooms !== undefined) {
      where.bathrooms = { gte: minBathrooms };
    }

    // Execute query
    const [properties, total] = await Promise.all([
      this.prisma.property.findMany({
        where,
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              profileImageUrl: true,
            },
          },
          images: {
            orderBy: { displayOrder: 'asc' },
          },
          _count: {
            select: {
              reservations: true,
              reviews: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      this.prisma.property.count({ where }),
    ]);

    return {
      data: properties,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            profileImageUrl: true,
          },
        },
        images: {
          orderBy: { displayOrder: 'asc' },
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
        },
        _count: {
          select: {
            reservations: true,
            reviews: true,
          },
        },
      },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    // Increment view count
    await this.prisma.property.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return property;
  }

  async findMyProperties(userId: string) {
    return this.prisma.property.findMany({
      where: { ownerId: userId },
      include: {
        images: {
          orderBy: { displayOrder: 'asc' },
        },
        _count: {
          select: {
            reservations: true,
            reviews: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, userId: string, dto: UpdatePropertyDto) {
    // Check if property exists and belongs to user
    const property = await this.prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.ownerId !== userId) {
      throw new ForbiddenException('You do not have permission to update this property');
    }

    const { images, ...updateData } = dto;

    // Update property
    const updated = await this.prisma.property.update({
      where: { id },
      data: {
        ...updateData,
        price: dto.price ? new Prisma.Decimal(dto.price) : undefined,
        sizeSqm: dto.sizeSqm ? new Prisma.Decimal(dto.sizeSqm) : undefined,
        coordinatesLat: dto.coordinatesLat ? new Prisma.Decimal(dto.coordinatesLat) : undefined,
        coordinatesLng: dto.coordinatesLng ? new Prisma.Decimal(dto.coordinatesLng) : undefined,
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            profileImageUrl: true,
          },
        },
        images: true,
      },
    });

    // Update images if provided
    if (images) {
      // Delete existing images
      await this.prisma.propertyImage.deleteMany({
        where: { propertyId: id },
      });

      // Add new images
      if (images.length > 0) {
        await this.prisma.propertyImage.createMany({
          data: images.map((url, index) => ({
            propertyId: id,
            imageUrl: url,
            isPrimary: index === 0,
            displayOrder: index,
          })),
        });
      }

      // Fetch the property again with new images
      return this.findOne(id);
    }

    return updated;
  }

  async remove(id: string, userId: string) {
    // Check if property exists and belongs to user
    const property = await this.prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.ownerId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this property');
    }

    await this.prisma.property.delete({
      where: { id },
    });

    return { message: 'Property deleted successfully' };
  }

  // Status Management Methods
  async updateStatus(id: string, status: PropertyStatus, userId?: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    // If userId is provided, verify ownership
    if (userId && property.ownerId !== userId) {
      throw new ForbiddenException('You do not have permission to update this property status');
    }

    return this.prisma.property.update({
      where: { id },
      data: { status },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        images: true,
      },
    });
  }

  async submitForVerification(id: string, userId: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.ownerId !== userId) {
      throw new ForbiddenException('You do not have permission to submit this property');
    }

    if (property.status !== PropertyStatus.DRAFT) {
      throw new BadRequestException('Only draft properties can be submitted for verification');
    }

    // Validate property has required information for verification
    if (!property.images || property.images.length === 0) {
      throw new BadRequestException('Property must have at least one image before submission');
    }

    if (!property.description || property.description.length < 50) {
      throw new BadRequestException('Property description must be at least 50 characters');
    }

    return this.updateStatus(id, PropertyStatus.PENDING_VERIFICATION);
  }

  async verifyProperty(id: string, adminUserId: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.status !== PropertyStatus.PENDING_VERIFICATION) {
      throw new BadRequestException('Only pending properties can be verified');
    }

    // Update property as verified and set verification timestamp
    const updated = await this.prisma.property.update({
      where: { id },
      data: {
        status: PropertyStatus.VERIFIED,
        isVerified: true,
        verifiedAt: new Date(),
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        images: true,
      },
    });

    // TODO: Create notification for property owner
    // await this.notificationService.create({
    //   userId: property.ownerId,
    //   type: NotificationType.SUCCESS,
    //   category: NotificationCategory.VERIFICATION,
    //   title: 'Property Verified',
    //   message: `Your property "${property.title}" has been verified and is now live.`,
    // });

    return updated;
  }

  async rejectProperty(id: string, adminUserId: string, reason?: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.status !== PropertyStatus.PENDING_VERIFICATION) {
      throw new BadRequestException('Only pending properties can be rejected');
    }

    // Set back to DRAFT status so owner can make changes
    const updated = await this.prisma.property.update({
      where: { id },
      data: {
        status: PropertyStatus.DRAFT,
        isVerified: false,
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        images: true,
      },
    });

    // TODO: Create notification for property owner with rejection reason
    // await this.notificationService.create({
    //   userId: property.ownerId,
    //   type: NotificationType.WARNING,
    //   category: NotificationCategory.VERIFICATION,
    //   title: 'Property Verification Rejected',
    //   message: `Your property "${property.title}" verification was rejected. ${reason || 'Please review and resubmit.'}`,
    // });

    return updated;
  }

  async markAsReserved(id: string) {
    return this.updateStatus(id, PropertyStatus.RESERVED);
  }

  async markAsSold(id: string) {
    return this.updateStatus(id, PropertyStatus.SOLD);
  }

  // Advanced Search and Filtering
  async searchNearby(lat: number, lng: number, radiusKm: number = 10, filters?: FilterPropertyDto) {
    // Simplified nearby search - in production, use PostGIS or similar
    const properties = await this.findAll(filters || {});
    
    // Filter by distance (rough calculation)
    const nearbyProperties = properties.data.filter(property => {
      if (!property.coordinatesLat || !property.coordinatesLng) return false;
      
      const distance = this.calculateDistance(
        lat,
        lng,
        Number(property.coordinatesLat),
        Number(property.coordinatesLng),
      );
      
      return distance <= radiusKm;
    });

    return {
      data: nearbyProperties,
      meta: {
        ...properties.meta,
        total: nearbyProperties.length,
      },
    };
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // Statistics
  async getPropertyStats(userId: string) {
    const [total, draft, pending, verified, reserved, sold] = await Promise.all([
      this.prisma.property.count({ where: { ownerId: userId } }),
      this.prisma.property.count({ where: { ownerId: userId, status: PropertyStatus.DRAFT } }),
      this.prisma.property.count({ where: { ownerId: userId, status: PropertyStatus.PENDING_VERIFICATION } }),
      this.prisma.property.count({ where: { ownerId: userId, status: PropertyStatus.VERIFIED } }),
      this.prisma.property.count({ where: { ownerId: userId, status: PropertyStatus.RESERVED } }),
      this.prisma.property.count({ where: { ownerId: userId, status: PropertyStatus.SOLD } }),
    ]);

    return {
      total,
      byStatus: {
        draft,
        pending,
        verified,
        reserved,
        sold,
      },
    };
  }

  async getPropertyAnalytics(propertyId: string, userId: string) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        images: true,
        reservations: {
          include: {
            buyer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        reviews: {
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
        projects: {
          select: {
            id: true,
            projectType: true,
            status: true,
          },
        },
      },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.ownerId !== userId) {
      throw new ForbiddenException('You do not have permission to view this property analytics');
    }

    // Calculate analytics
    const totalReservations = property.reservations.length;
    const activeReservations = property.reservations.filter(
      r => r.status === 'ACTIVE'
    ).length;
    
    const totalReviews = property.reviews.length;
    const averageRating = totalReviews > 0
      ? property.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

    return {
      property: {
        id: property.id,
        title: property.title,
        status: property.status,
        viewCount: property.viewCount,
        createdAt: property.createdAt,
      },
      engagement: {
        totalViews: property.viewCount,
        totalReservations,
        activeReservations,
        totalReviews,
        averageRating: parseFloat(averageRating.toFixed(2)),
      },
      reservations: property.reservations.map(r => ({
        id: r.id,
        user: r.buyer,
        status: r.status,
        reservationDate: r.reservationDate,
        expiresAt: r.expiryDate,
      })),
      reviews: property.reviews.map(r => ({
        id: r.id,
        user: r.reviewer,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
      })),
      projects: property.projects,
    };
  }

  // Save Property
  async saveProperty(userId: string, dto: SavePropertyDto) {
    // Check if property exists
    const property = await this.prisma.property.findUnique({
      where: { id: dto.propertyId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    // Check if already saved
    const existing = await this.prisma.savedProperty.findUnique({
      where: {
        userId_propertyId: {
          userId,
          propertyId: dto.propertyId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Property already saved');
    }

    const savedProperty = await this.prisma.savedProperty.create({
      data: {
        userId,
        propertyId: dto.propertyId,
        notes: dto.notes,
      },
      include: {
        property: {
          include: {
            images: true,
            owner: {
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
      },
    });

    return savedProperty;
  }

  async unsaveProperty(userId: string, propertyId: string) {
    const savedProperty = await this.prisma.savedProperty.findUnique({
      where: {
        userId_propertyId: {
          userId,
          propertyId,
        },
      },
    });

    if (!savedProperty) {
      throw new NotFoundException('Saved property not found');
    }

    await this.prisma.savedProperty.delete({
      where: {
        userId_propertyId: {
          userId,
          propertyId,
        },
      },
    });

    return { message: 'Property removed from saved list' };
  }

  async getSavedProperties(userId: string) {
    const savedProperties = await this.prisma.savedProperty.findMany({
      where: { userId },
      include: {
        property: {
          include: {
            images: true,
            owner: {
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
      },
      orderBy: { savedAt: 'desc' },
    });

    return savedProperties;
  }

  async checkIfSaved(userId: string, propertyId: string) {
    const saved = await this.prisma.savedProperty.findUnique({
      where: {
        userId_propertyId: {
          userId,
          propertyId,
        },
      },
    });

    return { isSaved: !!saved };
  }

  // Property Viewing
  async scheduleViewing(userId: string, dto: ScheduleViewingDto) {
    // Check if property exists
    const property = await this.prisma.property.findUnique({
      where: { id: dto.propertyId },
      include: { owner: true },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    // Create viewing request
    const viewing = await this.prisma.propertyViewing.create({
      data: {
        propertyId: dto.propertyId,
        requestedBy: userId,
        ownerId: property.ownerId,
        preferredDate: new Date(dto.preferredDate),
        preferredTime: dto.preferredTime,
        contactName: dto.contactName,
        contactEmail: dto.contactEmail,
        contactPhone: dto.contactPhone,
        message: dto.message,
        status: ViewingStatus.REQUESTED,
      },
      include: {
        property: {
          include: {
            images: true,
          },
        },
        owner: {
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

    // TODO: Send notification to property owner
    await this.prisma.notification.create({
      data: {
        userId: property.ownerId,
        type: 'INFO',
        category: 'PROPERTY',
        title: 'New Viewing Request',
        message: `${dto.contactName} has requested to view your property "${property.title}"`,
        linkUrl: `/my-properties/${property.id}/viewings`,
      },
    });

    return viewing;
  }

  async getViewingRequests(userId: string) {
    const viewings = await this.prisma.propertyViewing.findMany({
      where: { requestedBy: userId },
      include: {
        property: {
          include: {
            images: true,
            owner: {
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
      },
      orderBy: { requestedAt: 'desc' },
    });

    return viewings;
  }

  async getPropertyViewings(userId: string, propertyId: string) {
    // Verify ownership
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.ownerId !== userId) {
      throw new ForbiddenException('You can only view viewing requests for your own properties');
    }

    const viewings = await this.prisma.propertyViewing.findMany({
      where: { propertyId },
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
      },
      orderBy: { requestedAt: 'desc' },
    });

    return viewings;
  }

  // Contact Owner
  async contactOwner(userId: string, dto: ContactOwnerDto) {
    // Check if property exists
    const property = await this.prisma.property.findUnique({
      where: { id: dto.propertyId },
      include: { owner: true },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    // Create notification for owner
    await this.prisma.notification.create({
      data: {
        userId: property.ownerId,
        type: 'INFO',
        category: 'PROPERTY',
        title: 'New Message About Your Property',
        message: `${dto.name} (${dto.email}) sent you a message about "${property.title}": ${dto.message.substring(0, 100)}...`,
        linkUrl: `/my-properties/${property.id}`,
      },
    });

    // TODO: In a real app, send email notification here

    return {
      success: true,
      message: 'Your message has been sent to the property owner',
      ownerEmail: property.owner.email,
    };
  }
}
