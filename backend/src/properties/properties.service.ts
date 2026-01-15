import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePropertyDto, UpdatePropertyDto, FilterPropertyDto } from './dto';
import { PropertyStatus, Prisma } from '@prisma/client';

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreatePropertyDto) {
    const { images, ...propertyData } = dto;

    // Create property
    const property = await this.prisma.property.create({
      data: {
        ...propertyData,
        ownerId: userId,
        price: new Prisma.Decimal(dto.price),
        sizeSqm: dto.sizeSqm ? new Prisma.Decimal(dto.sizeSqm) : null,
        coordinatesLat: dto.coordinatesLat ? new Prisma.Decimal(dto.coordinatesLat) : null,
        coordinatesLng: dto.coordinatesLng ? new Prisma.Decimal(dto.coordinatesLng) : null,
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
      // Only show verified and available properties for public listing
      status: status || {
        in: [PropertyStatus.VERIFIED, PropertyStatus.PENDING_VERIFICATION],
      },
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
}
