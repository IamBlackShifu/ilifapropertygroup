import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierDto, UpdateSupplierDto, CreateProductDto, UpdateProductDto, CreateOrderDto, UpdateOrderDto } from './dto';
import { ProductCategory, SupplierStatus, OrderStatus, Prisma } from '@prisma/client';

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}

  // ==================== SUPPLIER CRUD ====================

  async createSupplier(userId: string, createSupplierDto: CreateSupplierDto) {
    // Check if user already has a supplier profile
    const existingSupplier = await this.prisma.supplier.findUnique({
      where: { userId },
    });

    if (existingSupplier) {
      throw new BadRequestException('Supplier profile already exists for this user');
    }

    // Transform DTO fields to match Prisma schema
    const { city, address, website, phone, email, ...rest } = createSupplierDto;

    // Update user's phone if provided and different from current value
    if (phone) {
      const currentUser = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { phone: true },
      });

      if (phone !== currentUser.phone) {
        await this.prisma.user.update({
          where: { id: userId },
          data: { phone },
        });
      }
    }

    return this.prisma.supplier.create({
      data: {
        ...rest,
        locationCity: city,
        locationAddress: address,
        websiteUrl: website,
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
          },
        },
      },
    });
  }

  async getSupplierProfile(userId: string) {
    const supplier = await this.prisma.supplier.findUnique({
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
        products: {
          where: { status: 'AVAILABLE' },
          take: 10,
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

    if (!supplier) {
      throw new NotFoundException('Supplier profile not found');
    }

    return supplier;
  }

  async updateSupplier(userId: string, updateSupplierDto: UpdateSupplierDto) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { userId },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier profile not found');
    }

    // Transform DTO fields to match Prisma schema
    const { city, address, website, phone, email, ...rest } = updateSupplierDto;
    const updateData: any = { ...rest };
    
    if (city !== undefined) updateData.locationCity = city;
    if (address !== undefined) updateData.locationAddress = address;
    if (website !== undefined) updateData.websiteUrl = website;

    // Update user's phone if provided and different from current value
    if (phone !== undefined) {
      const currentUser = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { phone: true },
      });

      if (phone !== currentUser.phone) {
        await this.prisma.user.update({
          where: { id: userId },
          data: { phone },
        });
      }
    }

    return this.prisma.supplier.update({
      where: { userId },
      data: updateData,
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
      },
    });
  }

  async getAllSuppliers(filters?: {
    category?: ProductCategory;
    city?: string;
    isVerified?: boolean;
    status?: SupplierStatus;
    search?: string;
  }) {
    const where: Prisma.SupplierWhereInput = {};
    
    // Only filter by status if explicitly provided
    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.category) {
      where.categories = {
        has: filters.category,
      };
    }

    if (filters?.city) {
      where.locationCity = {
        contains: filters.city,
        mode: 'insensitive',
      };
    }

    if (filters?.isVerified !== undefined) {
      where.isVerified = filters.isVerified;
    }

    if (filters?.search) {
      where.OR = [
        {
          companyName: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    return this.prisma.supplier.findMany({
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
            products: true,
            orders: true,
            reviews: true,
          },
        },
      },
      orderBy: [
        { isVerified: 'desc' },
        { ratingAverage: 'desc' },
        { createdAt: 'desc' },
      ],
    });
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
          },
        },
        products: {
          where: { status: 'AVAILABLE' },
          orderBy: { createdAt: 'desc' },
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
                profileImageUrl: true,
              },
            },
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

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    return supplier;
  }

  // ==================== PRODUCT CRUD ====================

  async createProduct(userId: string, createProductDto: CreateProductDto) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { userId },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier profile not found');
    }

    if (supplier.status !== 'VERIFIED') {
      throw new ForbiddenException('Only verified suppliers can add products');
    }

    return this.prisma.product.create({
      data: {
        ...createProductDto,
        supplierId: supplier.id,
      },
      include: {
        supplier: {
          select: {
            id: true,
            companyName: true,
            locationCity: true,
          },
        },
      },
    });
  }

  async getSupplierProducts(supplierId: string, filters?: {
    category?: ProductCategory;
    status?: string;
  }) {
    const where: Prisma.ProductWhereInput = {
      supplierId,
    };

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.status) {
      where.status = filters.status as any;
    }

    return this.prisma.product.findMany({
      where,
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' },
      ],
      include: {
        supplier: {
          select: {
            id: true,
            companyName: true,
            locationCity: true,
            isVerified: true,
          },
        },
      },
    });
  }

  async getProductById(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        supplier: {
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
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Increment view count
    await this.prisma.product.update({
      where: { id: productId },
      data: { viewCount: { increment: 1 } },
    });

    return product;
  }

  async updateProduct(userId: string, productId: string, updateProductDto: UpdateProductDto) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { userId },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier profile not found');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.supplierId !== supplier.id) {
      throw new ForbiddenException('You can only update your own products');
    }

    return this.prisma.product.update({
      where: { id: productId },
      data: updateProductDto,
    });
  }

  async deleteProduct(userId: string, productId: string) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { userId },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier profile not found');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.supplierId !== supplier.id) {
      throw new ForbiddenException('You can only delete your own products');
    }

    return this.prisma.product.delete({
      where: { id: productId },
    });
  }

  async searchProducts(filters: {
    category?: ProductCategory;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }) {
    const where: Prisma.ProductWhereInput = {
      status: 'AVAILABLE',
    };

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.search) {
      where.OR = [
        {
          name: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice) {
        where.price.gte = filters.minPrice;
      }
      if (filters.maxPrice) {
        where.price.lte = filters.maxPrice;
      }
    }

    if (filters.city) {
      where.supplier = {
        locationCity: {
          contains: filters.city,
          mode: 'insensitive',
        },
      };
    }

    return this.prisma.product.findMany({
      where,
      include: {
        supplier: {
          select: {
            id: true,
            companyName: true,
            locationCity: true,
            isVerified: true,
            ratingAverage: true,
          },
        },
      },
      orderBy: [
        { isFeatured: 'desc' },
        { viewCount: 'desc' },
      ],
      take: 50,
    });
  }

  // ==================== ORDER MANAGEMENT ====================

  async createOrder(buyerId: string, createOrderDto: CreateOrderDto) {
    const { supplierId, items, ...orderData } = createOrderDto;

    // Validate supplier
    const supplier = await this.prisma.supplier.findUnique({
      where: { id: supplierId },
    });

    if (!supplier || supplier.status !== 'VERIFIED') {
      throw new BadRequestException('Supplier not available');
    }

    // Validate products and calculate total
    let totalAmount = 0;
    const productIds = items.map(item => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== items.length) {
      throw new BadRequestException('Some products not found');
    }

    const orderItems = items.map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product || product.status !== 'AVAILABLE') {
        throw new BadRequestException(`Product ${product?.name || item.productId} not available`);
      }
      if (product.stockQuantity < item.quantity) {
        throw new BadRequestException(`Insufficient stock for ${product.name}`);
      }
      if (item.quantity < product.minOrderQty) {
        throw new BadRequestException(`Minimum order quantity for ${product.name} is ${product.minOrderQty}`);
      }

      const itemTotal = Number(product.price) * item.quantity;
      totalAmount += itemTotal;

      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price,
        totalPrice: itemTotal,
      };
    });

    // Check minimum order amount
    if (supplier.minOrderAmount && totalAmount < Number(supplier.minOrderAmount)) {
      throw new BadRequestException(`Minimum order amount is ${supplier.minOrderAmount}`);
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order with items in transaction
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          buyerId,
          supplierId,
          totalAmount,
          ...orderData,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          supplier: {
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
            },
          },
        },
      });

      // Update product stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: { decrement: item.quantity },
          },
        });
      }

      // Create notification for supplier
      await tx.notification.create({
        data: {
          userId: supplier.userId,
          type: 'ORDER_RECEIVED',
          category: 'ORDER',
          title: 'New Order Received',
          message: `You have received a new order #${orderNumber}`,
          linkUrl: `/suppliers/orders/${order.id}`,
        },
      });

      return order;
    });
  }

  async getSupplierOrders(userId: string, status?: OrderStatus) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { userId },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier profile not found');
    }

    const where: Prisma.OrderWhereInput = {
      supplierId: supplier.id,
    };

    if (status) {
      where.status = status;
    }

    return this.prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        buyer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { orderDate: 'desc' },
    });
  }

  async getBuyerOrders(buyerId: string, status?: OrderStatus) {
    const where: Prisma.OrderWhereInput = {
      buyerId,
    };

    if (status) {
      where.status = status;
    }

    return this.prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        supplier: {
          select: {
            id: true,
            companyName: true,
            locationCity: true,
            user: {
              select: {
                phone: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { orderDate: 'desc' },
    });
  }

  async getOrderById(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        buyer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        supplier: {
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
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateOrderStatus(userId: string, orderId: string, updateOrderDto: UpdateOrderDto) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { userId },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier profile not found');
    }

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.supplierId !== supplier.id) {
      throw new ForbiddenException('You can only update your own orders');
    }

    const updateData: any = {
      status: updateOrderDto.status,
    };

    // Set timestamps based on status
    if (updateOrderDto.status === 'CONFIRMED') {
      updateData.confirmedAt = new Date();
    } else if (updateOrderDto.status === 'DELIVERED') {
      updateData.deliveredAt = new Date();
    } else if (updateOrderDto.status === 'CANCELLED') {
      updateData.cancelledAt = new Date();
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        buyer: {
          select: {
            id: true,
          },
        },
      },
    });

    // Create notification for buyer
    await this.prisma.notification.create({
      data: {
        userId: updatedOrder.buyerId,
        type: 'ORDER_STATUS_UPDATED',
        category: 'ORDER',
        title: 'Order Status Updated',
        message: `Your order #${updatedOrder.orderNumber} status has been updated to ${updateOrderDto.status}`,
        linkUrl: `/suppliers/orders/${orderId}`,
      },
    });

    return updatedOrder;
  }

  // ==================== ANALYTICS ====================

  async getSupplierAnalytics(userId: string) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { userId },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier profile not found');
    }

    const [
      totalProducts,
      totalOrders,
      pendingOrders,
      totalRevenue,
      recentOrders,
    ] = await Promise.all([
      this.prisma.product.count({
        where: { supplierId: supplier.id },
      }),
      this.prisma.order.count({
        where: { supplierId: supplier.id },
      }),
      this.prisma.order.count({
        where: { supplierId: supplier.id, status: 'PENDING' },
      }),
      this.prisma.order.aggregate({
        where: {
          supplierId: supplier.id,
          status: { in: ['DELIVERED', 'CONFIRMED'] },
        },
        _sum: { totalAmount: true },
      }),
      this.prisma.order.findMany({
        where: { supplierId: supplier.id },
        take: 5,
        orderBy: { orderDate: 'desc' },
        include: {
          buyer: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
    ]);

    return {
      totalProducts,
      totalOrders,
      pendingOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      recentOrders,
      rating: {
        average: supplier.ratingAverage,
        count: supplier.ratingCount,
      },
    };
  }
}
