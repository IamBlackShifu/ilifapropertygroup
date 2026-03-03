import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a payment' })
  @ApiResponse({ status: 201, description: 'Payment created successfully' })
  async createPayment(@CurrentUser() user: any, @Body() createPaymentDto: any) {
    const payment = await this.paymentsService.createPayment({
      payerId: user.userId,
      ...createPaymentDto,
    });

    return {
      success: true,
      data: payment,
      message: 'Payment created successfully',
    };
  }

  @Post(':id/initiate-paynow')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initialize Paynow payment' })
  @ApiResponse({ status: 200, description: 'Payment initialized successfully' })
  async initiatePaynow(@CurrentUser() user: any, @Param('id') id: string) {
    const result = await this.paymentsService.initiatePaynowPayment(id);

    return {
      success: true,
      data: result,
      message: 'Payment initialized. Redirecting to Paynow...',
    };
  }

  @Get(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check payment status' })
  async checkPaymentStatus(@Param('id') id: string) {
    const status = await this.paymentsService.checkPaynowStatus(id);

    return {
      success: true,
      data: status,
    };
  }

  @Post('paynow/callback')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Paynow payment callback (webhook)' })
  async paynowCallback(@Body() callbackData: any) {
    console.log('Paynow callback received:', callbackData);
    await this.paymentsService.handlePaynowCallback(callbackData);

    return { success: true };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment by ID' })
  async getPayment(@Param('id') id: string) {
    const payment = await this.paymentsService.getPayment(id);

    return {
      success: true,
      data: payment,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user payments' })
  async getUserPayments(
    @CurrentUser() user: any,
    @Query('type') type?: 'sent' | 'received',
  ) {
    const payments = await this.paymentsService.getUserPayments(
      user.userId,
      type || 'sent',
    );

    return {
      success: true,
      data: payments,
    };
  }

  @Post('milestones/:milestoneId/pay')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create milestone payment' })
  async createMilestonePayment(
    @CurrentUser() user: any,
    @Param('milestoneId') milestoneId: string,
    @Body('projectId') projectId: string,
  ) {
    const payment = await this.paymentsService.processMilestonePayment(
      projectId,
      milestoneId,
      user.userId,
    );

    return {
      success: true,
      data: payment,
      message: 'Milestone payment created. Please complete payment.',
    };
  }

  @Post(':id/complete-milestone')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Complete milestone payment after successful payment' })
  async completeMilestonePayment(@Param('id') id: string) {
    const result = await this.paymentsService.completeMilestonePayment(id);

    return {
      success: true,
      data: result,
      message: 'Milestone marked as paid',
    };
  }
}
