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
}
