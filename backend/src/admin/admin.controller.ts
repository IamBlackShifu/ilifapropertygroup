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
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ==================== DASHBOARD ====================
  @Get('dashboard/stats')
  @ApiOperation({ summary: 'Get admin dashboard statistics' })
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  // ==================== USER MANAGEMENT ====================
  @Get('users')
  @ApiOperation({ summary: 'Get all users with filters' })
  async getAllUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('role') role?: string,
    @Query('search') search?: string,
    @Query('status') status?: 'active' | 'suspended' | 'all',
  ) {
    return this.adminService.getAllUsers({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      role: role as any,
      search,
      status,
    });
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user details by ID' })
  async getUserById(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  @Put('users/:id')
  @ApiOperation({ summary: 'Update user details' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateData: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      role?: string;
      emailVerified?: boolean;
    },
  ) {
    return this.adminService.updateUser(id, updateData as any);
  }

  @Post('users/:id/suspend')
  @ApiOperation({ summary: 'Suspend a user' })
  async suspendUser(
    @Param('id') id: string,
    @Body() body: { reason?: string },
  ) {
    return this.adminService.suspendUser(id, body.reason);
  }

  @Post('users/:id/activate')
  @ApiOperation({ summary: 'Activate a suspended user' })
  async activateUser(@Param('id') id: string) {
    return this.adminService.activateUser(id);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Delete a user permanently' })
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  // ==================== PROPERTY MANAGEMENT ====================
  @Get('properties')
  @ApiOperation({ summary: 'Get all properties with filters' })
  async getAllProperties(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.adminService.getAllProperties({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      status: status as any,
      search,
    });
  }

  @Put('properties/:id')
  @ApiOperation({ summary: 'Update property details' })
  async updateProperty(@Param('id') id: string, @Body() updateData: any) {
    return this.adminService.updateProperty(id, updateData);
  }

  @Delete('properties/:id')
  @ApiOperation({ summary: 'Delete a property permanently' })
  async deleteProperty(@Param('id') id: string) {
    return this.adminService.deleteProperty(id);
  }

  @Post('properties/:id/approve')
  @ApiOperation({ summary: 'Approve a property' })
  async approveProperty(@Param('id') id: string, @Request() req) {
    return this.adminService.approveProperty(id, req.user.id);
  }

  @Post('properties/:id/reject')
  @ApiOperation({ summary: 'Reject a property' })
  async rejectProperty(
    @Param('id') id: string,
    @Body() body: { rejectionReason: string },
    @Request() req,
  ) {
    return this.adminService.rejectProperty(
      id,
      req.user.id,
      body.rejectionReason,
    );
  }

  // ==================== VERIFICATION MANAGEMENT ====================
  @Get('verifications/pending')
  @ApiOperation({ summary: 'Get pending verifications' })
  async getPendingVerifications(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('entityType') entityType?: 'PROPERTY' | 'CONTRACTOR' | 'SUPPLIER' | 'USER',
  ) {
    return this.adminService.getPendingVerifications({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      entityType,
    });
  }

  @Post('verifications/:id/approve')
  @ApiOperation({ summary: 'Approve a verification request' })
  async approveVerification(@Param('id') id: string, @Request() req) {
    return this.adminService.approveVerification(id, req.user.id);
  }

  @Post('verifications/:id/reject')
  @ApiOperation({ summary: 'Reject a verification request' })
  async rejectVerification(
    @Param('id') id: string,
    @Body() body: { rejectionReason: string },
    @Request() req,
  ) {
    return this.adminService.rejectVerification(
      id,
      req.user.id,
      body.rejectionReason,
    );
  }

  // ==================== SUPPLIER MANAGEMENT ====================
  @Get('suppliers')
  @ApiOperation({ summary: 'Get all suppliers with filters' })
  async getAllSuppliers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: 'PENDING' | 'VERIFIED' | 'SUSPENDED',
    @Query('search') search?: string,
  ) {
    return this.adminService.getAllSuppliers({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      status,
      search,
    });
  }

  @Get('suppliers/:id')
  @ApiOperation({ summary: 'Get supplier details by ID' })
  async getSupplierById(@Param('id') id: string) {
    return this.adminService.getSupplierById(id);
  }

  @Post('suppliers/:id/verify')
  @ApiOperation({ summary: 'Verify a supplier' })
  async verifySupplier(@Param('id') id: string, @Request() req) {
    return this.adminService.verifySupplier(id, req.user.userId);
  }

  @Post('suppliers/:id/reject')
  @ApiOperation({ summary: 'Reject a supplier verification' })
  async rejectSupplier(
    @Param('id') id: string,
    @Body() body: { rejectionReason: string },
    @Request() req,
  ) {
    return this.adminService.rejectSupplier(id, req.user.userId, body.rejectionReason);
  }

  @Post('suppliers/:id/suspend')
  @ApiOperation({ summary: 'Suspend a supplier' })
  async suspendSupplier(
    @Param('id') id: string,
    @Body() body: { reason?: string },
  ) {
    return this.adminService.suspendSupplier(id, body.reason);
  }

  @Post('suppliers/:id/activate')
  @ApiOperation({ summary: 'Activate a suspended supplier' })
  async activateSupplier(@Param('id') id: string) {
    return this.adminService.activateSupplier(id);
  }

  // ==================== CONTRACTOR MANAGEMENT ====================
  @Get('contractors')
  @ApiOperation({ summary: 'Get all contractors with filters' })
  async getAllContractors(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: 'PENDING' | 'VERIFIED' | 'SUSPENDED',
    @Query('search') search?: string,
  ) {
    return this.adminService.getAllContractors({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      status,
      search,
    });
  }

  @Get('contractors/:id')
  @ApiOperation({ summary: 'Get contractor details by ID' })
  async getContractorById(@Param('id') id: string) {
    return this.adminService.getContractorById(id);
  }

  @Post('contractors/:id/verify')
  @ApiOperation({ summary: 'Verify a contractor' })
  async verifyContractor(@Param('id') id: string, @Request() req) {
    return this.adminService.verifyContractor(id, req.user.userId);
  }

  @Post('contractors/:id/reject')
  @ApiOperation({ summary: 'Reject a contractor verification' })
  async rejectContractor(
    @Param('id') id: string,
    @Body() body: { rejectionReason: string },
    @Request() req,
  ) {
    return this.adminService.rejectContractor(id, req.user.userId, body.rejectionReason);
  }

  @Post('contractors/:id/suspend')
  @ApiOperation({ summary: 'Suspend a contractor' })
  async suspendContractor(
    @Param('id') id: string,
    @Body() body: { reason?: string },
  ) {
    return this.adminService.suspendContractorAccount(id, body.reason);
  }

  @Post('contractors/:id/activate')
  @ApiOperation({ summary: 'Activate a suspended contractor' })
  async activateContractor(@Param('id') id: string) {
    return this.adminService.activateContractor(id);
  }

  // ==================== SUBSCRIPTION & PAYMENT MANAGEMENT ====================
  @Get('subscriptions')
  @ApiOperation({ summary: 'Get all subscriptions' })
  async getAllSubscriptions(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('plan') plan?: string,
  ) {
    return this.adminService.getAllSubscriptions({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      status,
      plan,
    });
  }

  @Get('subscriptions/stats')
  @ApiOperation({ summary: 'Get subscription statistics' })
  async getSubscriptionStats() {
    return this.adminService.getSubscriptionStats();
  }

  @Get('payments')
  @ApiOperation({ summary: 'Get all payments' })
  async getAllPayments(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getAllPayments({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      status,
    });
  }

  @Get('payments/stats')
  @ApiOperation({ summary: 'Get payment statistics' })
  async getPaymentStats() {
    return this.adminService.getPaymentStats();
  }
}
