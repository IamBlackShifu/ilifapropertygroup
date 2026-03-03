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

  // ==================== INVENTORY MANAGEMENT ====================

  // Update product stock quantity
  async updateStock(userId: string, productId: string, quantity: number, operation: 'add' | 'set' | 'subtract') {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { supplier: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.supplier.userId !== userId) {
      throw new ForbiddenException('You can only manage your own products');
    }

    let newQuantity: number;
    if (operation === 'set') {
      newQuantity = quantity;
    } else if (operation === 'add') {
      newQuantity = product.stockQuantity + quantity;
    } else {
      newQuantity = product.stockQuantity - quantity;
    }

    if (newQuantity < 0) {
      throw new BadRequestException('Stock quantity cannot be negative');
    }

    // Update stock and check against reorder level
    const updated = await this.prisma.product.update({
      where: { id: productId },
      data: {
        stockQuantity: newQuantity,
        status: newQuantity === 0 ? 'OUT_OF_STOCK' : 'AVAILABLE',
        lowStockAlert: product.reorderLevel ? newQuantity <= product.reorderLevel : false,
        lastRestockedAt: operation === 'add' ? new Date() : product.lastRestockedAt,
      },
    });

    // Create notification if low stock
    if (updated.lowStockAlert && updated.reorderLevel) {
      await this.prisma.notification.create({
        data: {
          userId,
          type: 'WARNING',
          category: 'SYSTEM',
          title: 'Low Stock Alert',
          message: `Product "${product.name}" is running low (${newQuantity} remaining). Reorder level: ${product.reorderLevel}`,
          linkUrl: `/supplier/products/${productId}`,
        },
      });
    }

    return updated;
  }

  // Set reorder levels
  async setReorderLevel(userId: string, productId: string, reorderLevel: number, reorderQuantity: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { supplier: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.supplier.userId !== userId) {
      throw new ForbiddenException('You can only manage your own products');
    }

    return this.prisma.product.update({
      where: { id: productId },
      data: {
        reorderLevel,
        reorderQuantity,
        lowStockAlert: product.stockQuantity <= reorderLevel,
      },
    });
  }

  // Get low stock products
  async getLowStockProducts(userId: string) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { userId },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier profile not found');
    }

    return this.prisma.product.findMany({
      where: {
        supplierId: supplier.id,
        lowStockAlert: true,
      },
      orderBy: {
        stockQuantity: 'asc',
      },
    });
  }

  // Get inventory summary
  async getInventorySummary(userId: string) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { userId },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier profile not found');
    }

    const [
      totalProducts,
      inStock,
      outOfStock,
      lowStock,
      totalValue,
    ] = await Promise.all([
      this.prisma.product.count({
        where: { supplierId: supplier.id },
      }),
      this.prisma.product.count({
        where: { 
          supplierId: supplier.id,
          stockQuantity: { gt: 0 },
          status: 'AVAILABLE',
        },
      }),
      this.prisma.product.count({
        where: { 
          supplierId: supplier.id,
          status: 'OUT_OF_STOCK',
        },
      }),
      this.prisma.product.count({
        where: { 
          supplierId: supplier.id,
          lowStockAlert: true,
        },
      }),
      this.prisma.product.aggregate({
        where: { supplierId: supplier.id },
        _sum: {
          stockQuantity: true,
        },
      }),
    ]);

    // Get products by category
    const productsByCategory = await this.prisma.product.groupBy({
      by: ['category'],
      where: { supplierId: supplier.id },
      _count: {
        id: true,
      },
      _sum: {
        stockQuantity: true,
      },
    });

    return {
      totalProducts,
      inStock,
      outOfStock,
      lowStock,
      totalValue: totalValue._sum.stockQuantity || 0,
      productsByCategory: productsByCategory.map(cat => ({
        category: cat.category,
        count: cat._count.id,
        totalQuantity: cat._sum.stockQuantity || 0,
      })),
    };
  }

  // Bulk update stock (for CSV imports, etc.)
  async bulkUpdateStock(userId: string, updates: Array<{ productId: string; quantity: number }>) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { userId },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier profile not found');
    }

    const results = [];
    for (const update of updates) {
      try {
        const product = await this.updateStock(userId, update.productId, update.quantity, 'set');
        results.push({ productId: update.productId, success: true, product });
      } catch (error) {
        results.push({ 
          productId: update.productId, 
          success: false, 
          error: error.message 
        });
      }
    }

    return {
      total: updates.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results,
    };
  }

  // ==================== BULK ORDERING ====================

  // Create bulk order (for contractors/buyers ordering multiple items from multiple suppliers)
  async createBulkOrder(userId: string, orders: Array<{
    supplierId: string;
    items: Array<{ productId: string; quantity: number }>;
    deliveryAddress: string;
    deliveryCity: string;
    contactName: string;
    contactPhone: string;
    notes?: string;
  }>) {
    const results = [];

    for (const orderData of orders) {
      try {
        const order = await this.createOrder(userId, orderData as any);
        results.push({
          supplierId: orderData.supplierId,
          success: true,
          order,
        });
      } catch (error) {
        results.push({
          supplierId: orderData.supplierId,
          success: false,
          error: error.message,
        });
      }
    }

    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    return {
      total: orders.length,
      successful: successful.length,
      failed: failed.length,
      totalAmount: successful.reduce((sum, r) => sum + Number(r.order?.totalAmount || 0), 0),
      results,
    };
  }

  // Get bulk order discounts (for large quantity orders)
  async calculateBulkDiscount(productId: string, quantity: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const basePrice = Number(product.price);
    let discount = 0;

    // Apply tiered discounts based on quantity
    if (quantity >= 100) {
      discount = 0.15; // 15% discount for 100+ units
    } else if (quantity >= 50) {
      discount = 0.10; // 10% discount for 50+ units
    } else if (quantity >= 20) {
      discount = 0.05; // 5% discount for 20+ units
    }

    const unitPrice = basePrice * (1 - discount);
    const totalPrice = unitPrice * quantity;
    const savings = (basePrice * quantity) - totalPrice;

    return {
      productId: product.id,
      productName: product.name,
      quantity,
      basePrice,
      discount: discount * 100, // Convert to percentage
      unitPriceAfterDiscount: unitPrice,
      totalPrice,
      savings,
      minOrderQuantity: product.minOrderQty,
      stockAvailable: product.stockQuantity,
    };
  }

  // Generate bulk order quote
  async generateBulkQuote(userId: string, items: Array<{ productId: string; quantity: number }>) {
    const quoteItems = [];
    let subtotal = 0;

    for (const item of items) {
      const discountInfo = await this.calculateBulkDiscount(item.productId, item.quantity);
      quoteItems.push(discountInfo);
      subtotal += discountInfo.totalPrice;
    }

    // Apply additional bulk order discount if total is high
    let additionalDiscount = 0;
    if (subtotal >= 10000) {
      additionalDiscount = 0.05; // 5% additional discount for orders over $10,000
    } else if (subtotal >= 5000) {
      additionalDiscount = 0.03; // 3% additional discount for orders over $5,000
    }

    const additionalDiscountAmount = subtotal * additionalDiscount;
    const total = subtotal - additionalDiscountAmount;
    const totalSavings = quoteItems.reduce((sum, item) => sum + item.savings, 0) + additionalDiscountAmount;

    return {
      quoteNumber: `BQ-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`,
      generatedAt: new Date(),
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Valid for 7 days
      items: quoteItems,
      subtotal,
      additionalDiscount: additionalDiscount * 100,
      additionalDiscountAmount,
      total,
      totalSavings,
      itemCount: items.length,
      totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    };
  }

  // Request bulk order from supplier (for special negotiations)
  async requestBulkOrderQuote(
    userId: string,
    supplierId: string,
    items: Array<{ productId: string; quantity: number }>,
    message: string,
  ) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id: supplierId },
      include: { user: true },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    // Generate initial quote
    const quote = await this.generateBulkQuote(userId, items);

    // Create notification for supplier
    await this.prisma.notification.create({
      data: {
        userId: supplier.userId,
        type: 'INFO',
        category: 'ORDER',
        title: 'Bulk Order Quote Request',
        message: `A customer has requested a bulk order quote for ${items.length} products (${quote.totalQuantity} units total). Estimated value: $${quote.total.toFixed(2)}`,
        linkUrl: `/supplier/bulk-orders`,
      },
    });

    // In a real app, you'd save this quote request to the database
    return {
      success: true,
      quote,
      message: 'Bulk order quote request sent to supplier. They will review and respond soon.',
      supplierContact: {
        email: supplier.user.email,
        phone: supplier.user.phone,
      },
    };
  }
}
