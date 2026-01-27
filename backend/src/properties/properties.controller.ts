import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto, UpdatePropertyDto, FilterPropertyDto } from './dto';
import { SavePropertyDto } from './dto/save-property.dto';
import { ScheduleViewingDto } from './dto/schedule-viewing.dto';
import { ContactOwnerDto } from './dto/contact-owner.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new property listing' })
  @ApiResponse({ status: 201, description: 'Property created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@CurrentUser() user: any, @Body() createPropertyDto: CreatePropertyDto) {
    const property = await this.propertiesService.create(user.userId, createPropertyDto);
    return {
      success: true,
      data: property,
      message: 'Property created successfully',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all properties with filters' })
  @ApiResponse({ status: 200, description: 'Properties retrieved successfully' })
  async findAll(@Query() filters: FilterPropertyDto) {
    const result = await this.propertiesService.findAll(filters);
    return {
      success: true,
      data: result.data,
      meta: result.meta,
    };
  }

  @Get('my-properties')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user properties' })
  @ApiResponse({ status: 200, description: 'User properties retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findMyProperties(@CurrentUser() user: any) {
    const properties = await this.propertiesService.findMyProperties(user.userId);
    return {
      success: true,
      data: properties,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single property by ID' })
  @ApiResponse({ status: 200, description: 'Property retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async findOne(@Param('id') id: string) {
    const property = await this.propertiesService.findOne(id);
    return {
      success: true,
      data: property,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update property' })
  @ApiResponse({ status: 200, description: 'Property updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    const property = await this.propertiesService.update(id, user.userId, updatePropertyDto);
    return {
      success: true,
      data: property,
      message: 'Property updated successfully',
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete property' })
  @ApiResponse({ status: 200, description: 'Property deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    const result = await this.propertiesService.remove(id, user.userId);
    return {
      success: true,
      message: result.message,
    };
  }

  @Patch(':id/submit-verification')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit property for verification' })
  @ApiResponse({ status: 200, description: 'Property submitted for verification' })
  async submitForVerification(@Param('id') id: string, @CurrentUser() user: any) {
    const property = await this.propertiesService.submitForVerification(id, user.userId);
    return {
      success: true,
      data: property,
      message: 'Property submitted for verification',
    };
  }

  @Patch(':id/verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify property (Admin only)' })
  @ApiResponse({ status: 200, description: 'Property verified successfully' })
  async verifyProperty(@Param('id') id: string, @CurrentUser() user: any) {
    const property = await this.propertiesService.verifyProperty(id, user.userId);
    return {
      success: true,
      data: property,
      message: 'Property verified successfully',
    };
  }

  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject property verification (Admin only)' })
  @ApiResponse({ status: 200, description: 'Property verification rejected' })
  async rejectProperty(
    @Param('id') id: string, 
    @CurrentUser() user: any,
    @Body() body: { reason?: string }
  ) {
    const property = await this.propertiesService.rejectProperty(id, user.userId, body.reason);
    return {
      success: true,
      data: property,
      message: 'Property verification rejected',
    };
  }

  @Patch(':id/reserve')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark property as reserved' })
  @ApiResponse({ status: 200, description: 'Property marked as reserved' })
  async markAsReserved(@Param('id') id: string) {
    const property = await this.propertiesService.markAsReserved(id);
    return {
      success: true,
      data: property,
      message: 'Property marked as reserved',
    };
  }

  @Patch(':id/sold')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark property as sold' })
  @ApiResponse({ status: 200, description: 'Property marked as sold' })
  async markAsSold(@Param('id') id: string) {
    const property = await this.propertiesService.markAsSold(id);
    return {
      success: true,
      data: property,
      message: 'Property marked as sold',
    };
  }

  @Get('user/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user property statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getPropertyStats(@CurrentUser() user: any) {
    const stats = await this.propertiesService.getPropertyStats(user.userId);
    return {
      success: true,
      data: stats,
    };
  }

  @Get(':id/analytics')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get detailed analytics for a property' })
  @ApiResponse({ status: 200, description: 'Analytics retrieved successfully' })
  async getPropertyAnalytics(@Param('id') id: string, @CurrentUser() user: any) {
    const analytics = await this.propertiesService.getPropertyAnalytics(id, user.userId);
    return {
      success: true,
      data: analytics,
    };
  }

  // Save Property Endpoints
  @Post('saved')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Save a property to user\'s favorites' })
  @ApiResponse({ status: 201, description: 'Property saved successfully' })
  async saveProperty(@CurrentUser() user: any, @Body() dto: SavePropertyDto) {
    const savedProperty = await this.propertiesService.saveProperty(user.userId, dto);
    return {
      success: true,
      data: savedProperty,
      message: 'Property saved successfully',
    };
  }

  @Delete('saved/:propertyId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a property from saved list' })
  @HttpCode(HttpStatus.OK)
  async unsaveProperty(@CurrentUser() user: any, @Param('propertyId') propertyId: string) {
    const result = await this.propertiesService.unsaveProperty(user.userId, propertyId);
    return {
      success: true,
      message: result.message,
    };
  }

  @Get('saved/list')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user\'s saved properties' })
  async getSavedProperties(@CurrentUser() user: any) {
    const savedProperties = await this.propertiesService.getSavedProperties(user.userId);
    return {
      success: true,
      data: savedProperties,
    };
  }

  @Get('saved/check/:propertyId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check if property is saved by user' })
  async checkIfSaved(@CurrentUser() user: any, @Param('propertyId') propertyId: string) {
    const result = await this.propertiesService.checkIfSaved(user.userId, propertyId);
    return {
      success: true,
      data: result,
    };
  }

  // Property Viewing Endpoints
  @Post('viewings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Schedule a property viewing' })
  @ApiResponse({ status: 201, description: 'Viewing scheduled successfully' })
  async scheduleViewing(@CurrentUser() user: any, @Body() dto: ScheduleViewingDto) {
    const viewing = await this.propertiesService.scheduleViewing(user.userId, dto);
    return {
      success: true,
      data: viewing,
      message: 'Viewing request sent successfully',
    };
  }

  @Get('viewings/my-requests')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user\'s viewing requests' })
  async getViewingRequests(@CurrentUser() user: any) {
    const viewings = await this.propertiesService.getViewingRequests(user.userId);
    return {
      success: true,
      data: viewings,
    };
  }

  @Get(':id/viewings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get viewing requests for a property (owner only)' })
  async getPropertyViewings(@CurrentUser() user: any, @Param('id') id: string) {
    const viewings = await this.propertiesService.getPropertyViewings(user.userId, id);
    return {
      success: true,
      data: viewings,
    };
  }

  // Contact Owner Endpoint
  @Post('contact-owner')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send message to property owner' })
  @ApiResponse({ status: 201, description: 'Message sent successfully' })
  async contactOwner(@CurrentUser() user: any, @Body() dto: ContactOwnerDto) {
    const result = await this.propertiesService.contactOwner(user.userId, dto);
    return {
      success: true,
      data: result,
      message: result.message,
    };
  }
}
