import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateSupplierDto, UpdateSupplierDto, CreateProductDto, UpdateProductDto, CreateOrderDto, UpdateOrderDto } from './dto';
import { ProductCategory, SupplierStatus, OrderStatus } from '@prisma/client';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  // ==================== SUPPLIER ROUTES ====================

  // Specific routes must come before parameterized routes
  @Get('profile/me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPPLIER')
  getMyProfile(@Request() req) {
    return this.suppliersService.getSupplierProfile(req.user.userId);
  }

  @Post('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPPLIER')
  createSupplier(@Request() req, @Body() createSupplierDto: CreateSupplierDto) {
    return this.suppliersService.createSupplier(req.user.userId, createSupplierDto);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPPLIER')
  updateSupplier(@Request() req, @Body() updateSupplierDto: UpdateSupplierDto) {
    return this.suppliersService.updateSupplier(req.user.userId, updateSupplierDto);
  }

  @Get()
  getAllSuppliers(
    @Query('category') category?: ProductCategory,
    @Query('city') city?: string,
    @Query('isVerified') isVerified?: string,
    @Query('status') status?: SupplierStatus,
    @Query('search') search?: string,
  ) {
    return this.suppliersService.getAllSuppliers({
      category,
      city,
      isVerified: isVerified === 'true',
      status,
      search,
    });
  }

  @Get(':id')
  getSupplierById(@Param('id') id: string) {
    return this.suppliersService.getSupplierById(id);
  }

  // ==================== PRODUCT ROUTES ====================

  // Specific routes must come before parameterized routes
  @Get('products/search')
  searchProducts(
    @Query('category') category?: ProductCategory,
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('search') search?: string,
  ) {
    return this.suppliersService.searchProducts({
      category,
      city,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      search,
    });
  }

  @Post('products')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPPLIER')
  createProduct(@Request() req, @Body() createProductDto: CreateProductDto) {
    return this.suppliersService.createProduct(req.user.userId, createProductDto);
  }

  @Get('products/:id')
  getProductById(@Param('id') id: string) {
    return this.suppliersService.getProductById(id);
  }

  @Put('products/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPPLIER')
  updateProduct(
    @Request() req,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.suppliersService.updateProduct(req.user.userId, id, updateProductDto);
  }

  @Delete('products/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPPLIER')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteProduct(@Request() req, @Param('id') id: string) {
    return this.suppliersService.deleteProduct(req.user.userId, id);
  }

  @Get(':supplierId/products')
  getSupplierProducts(
    @Param('supplierId') supplierId: string,
    @Query('category') category?: ProductCategory,
    @Query('status') status?: string,
  ) {
    return this.suppliersService.getSupplierProducts(supplierId, { category, status });
  }

  // ==================== ORDER ROUTES ====================

  @Post('orders')
  @UseGuards(JwtAuthGuard)
  createOrder(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    return this.suppliersService.createOrder(req.user.userId, createOrderDto);
  }

  @Get('orders/my-orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPPLIER')
  getMySupplierOrders(
    @Request() req,
    @Query('status') status?: OrderStatus,
  ) {
    return this.suppliersService.getSupplierOrders(req.user.userId, status);
  }

  @Get('orders/my-purchases')
  @UseGuards(JwtAuthGuard)
  getMyPurchases(
    @Request() req,
    @Query('status') status?: OrderStatus,
  ) {
    return this.suppliersService.getBuyerOrders(req.user.userId, status);
  }

  @Get('orders/:id')
  @UseGuards(JwtAuthGuard)
  getOrderById(@Param('id') id: string) {
    return this.suppliersService.getOrderById(id);
  }

  @Put('orders/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPPLIER')
  updateOrderStatus(
    @Request() req,
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.suppliersService.updateOrderStatus(req.user.userId, id, updateOrderDto);
  }

  // ==================== ANALYTICS ====================

  @Get('analytics/dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPPLIER')
  getAnalytics(@Request() req) {
    return this.suppliersService.getSupplierAnalytics(req.user.userId);
  }

  // ==================== INVENTORY MANAGEMENT ====================

  @Post('products/:id/stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPPLIER')
  updateStock(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { quantity: number; operation: 'add' | 'set' | 'subtract' },
  ) {
    return this.suppliersService.updateStock(
      req.user.userId,
      id,
      body.quantity,
      body.operation,
    );
  }

  @Post('products/:id/reorder-level')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPPLIER')
  setReorderLevel(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { reorderLevel: number; reorderQuantity: number },
  ) {
    return this.suppliersService.setReorderLevel(
      req.user.userId,
      id,
      body.reorderLevel,
      body.reorderQuantity,
    );
  }

  @Get('inventory/low-stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPPLIER')
  getLowStockProducts(@Request() req) {
    return this.suppliersService.getLowStockProducts(req.user.userId);
  }

  @Get('inventory/summary')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPPLIER')
  getInventorySummary(@Request() req) {
    return this.suppliersService.getInventorySummary(req.user.userId);
  }

  @Post('inventory/bulk-update')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPPLIER')
  bulkUpdateStock(
    @Request() req,
    @Body() body: { updates: Array<{ productId: string; quantity: number }> },
  ) {
    return this.suppliersService.bulkUpdateStock(req.user.userId, body.updates);
  }

  // ==================== BULK ORDERING ====================

  @Post('orders/bulk')
  @UseGuards(JwtAuthGuard)
  createBulkOrder(
    @Request() req,
    @Body() body: {
      orders: Array<{
        supplierId: string;
        items: Array<{ productId: string; quantity: number }>;
        deliveryAddress: string;
        deliveryCity: string;
        contactName: string;
        contactPhone: string;
        notes?: string;
      }>;
    },
  ) {
    return this.suppliersService.createBulkOrder(req.user.userId, body.orders);
  }

  @Post('products/:id/bulk-discount')
  @UseGuards(JwtAuthGuard)
  calculateBulkDiscount(
    @Param('id') id: string,
    @Body() body: { quantity: number },
  ) {
    return this.suppliersService.calculateBulkDiscount(id, body.quantity);
  }

  @Post('bulk-quote')
  @UseGuards(JwtAuthGuard)
  generateBulkQuote(
    @Request() req,
    @Body() body: { items: Array<{ productId: string; quantity: number }> },
  ) {
    return this.suppliersService.generateBulkQuote(req.user.userId, body.items);
  }

  @Post('bulk-quote-request')
  @UseGuards(JwtAuthGuard)
  requestBulkOrderQuote(
    @Request() req,
    @Body() body: {
      supplierId: string;
      items: Array<{ productId: string; quantity: number }>;
      message: string;
    },
  ) {
    return this.suppliersService.requestBulkOrderQuote(
      req.user.userId,
      body.supplierId,
      body.items,
      body.message,
    );
  }
}
