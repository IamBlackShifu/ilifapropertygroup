import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceRequestDto, UpdateServiceRequestDto } from './dto/service-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post('requests')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a service request' })
  async createRequest(
    @CurrentUser() user: any,
    @Body() dto: CreateServiceRequestDto,
  ) {
    const request = await this.servicesService.createRequest(user.userId, dto);
    return {
      success: true,
      data: request,
      message: 'Service request created successfully',
    };
  }

  @Get('requests/my-requests')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my service requests' })
  async getMyRequests(
    @CurrentUser() user: any,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.servicesService.getMyRequests(user.userId, {
      status,
      page: page || 1,
      limit: limit || 10,
    });
    return {
      success: true,
      ...result,
    };
  }

  @Get('requests/contractor-requests')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get service requests for my contractor profile' })
  async getContractorRequests(
    @CurrentUser() user: any,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    // Get contractor ID from user
    const contractor = await this.servicesService['prisma'].contractor.findUnique({
      where: { userId: user.userId },
    });

    if (!contractor) {
      return {
        success: false,
        message: 'Contractor profile not found',
        data: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
      };
    }

    const result = await this.servicesService.getContractorRequests(
      contractor.id,
      { status, page: page || 1, limit: limit || 10 },
    );
    return {
      success: true,
      ...result,
    };
  }

  @Get('requests/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get service request by ID' })
  async getRequestById(@Param('id') id: string, @CurrentUser() user: any) {
    const request = await this.servicesService.getRequestById(id, user.userId);
    return {
      success: true,
      data: request,
    };
  }

  @Patch('requests/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update service request (contractor only)' })
  async updateRequest(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: UpdateServiceRequestDto,
  ) {
    const request = await this.servicesService.updateRequest(
      id,
      user.userId,
      dto,
    );
    return {
      success: true,
      data: request,
      message: 'Service request updated successfully',
    };
  }

  @Delete('requests/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel service request (requester only)' })
  async cancelRequest(@Param('id') id: string, @CurrentUser() user: any) {
    const request = await this.servicesService.cancelRequest(id, user.userId);
    return {
      success: true,
      data: request,
      message: 'Service request cancelled',
    };
  }
}
