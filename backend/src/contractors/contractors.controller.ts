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
import { ContractorsService } from './contractors.service';
import { CreateContractorDto, UpdateContractorDto, FilterContractorDto, RateContractorDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Contractors')
@Controller('contractors')
export class ContractorsController {
  constructor(private readonly contractorsService: ContractorsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create contractor profile' })
  @ApiResponse({ status: 201, description: 'Contractor profile created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@CurrentUser() user: any, @Body() createContractorDto: CreateContractorDto) {
    const contractor = await this.contractorsService.create(user.userId, createContractorDto);
    return {
      success: true,
      data: contractor,
      message: 'Contractor profile created successfully',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all contractors with filters' })
  @ApiResponse({ status: 200, description: 'Contractors retrieved successfully' })
  async findAll(@Query() filters: FilterContractorDto) {
    const result = await this.contractorsService.findAll(filters);
    return {
      success: true,
      data: result.data,
      meta: result.meta,
    };
  }

  @Post('my-profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create contractor profile for current user' })
  @ApiResponse({ status: 201, description: 'Contractor profile created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Profile already exists' })
  async createMyProfile(@CurrentUser() user: any, @Body() createContractorDto: CreateContractorDto) {
    const contractor = await this.contractorsService.create(user.userId, createContractorDto);
    return {
      success: true,
      data: contractor,
      message: 'Contractor profile created successfully',
    };
  }

  @Get('my-profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user contractor profile' })
  @ApiResponse({ status: 200, description: 'Contractor profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Contractor profile not found' })
  async getMyProfile(@CurrentUser() user: any) {
    const contractor = await this.contractorsService.findByUserId(user.userId);
    return {
      success: true,
      data: contractor,
    };
  }

  @Get('service/:service')
  @ApiOperation({ summary: 'Get contractors by service category' })
  @ApiResponse({ status: 200, description: 'Contractors retrieved successfully' })
  async findByService(@Param('service') service: string, @Query() filters: FilterContractorDto) {
    const result = await this.contractorsService.findByService(service, filters);
    return {
      success: true,
      data: result.data,
      meta: result.meta,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single contractor by ID' })
  @ApiResponse({ status: 200, description: 'Contractor retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Contractor not found' })
  async findOne(@Param('id') id: string) {
    const contractor = await this.contractorsService.findOne(id);
    return {
      success: true,
      data: contractor,
    };
  }

  @Get(':id/reviews')
  @ApiOperation({ summary: 'Get contractor reviews' })
  @ApiResponse({ status: 200, description: 'Reviews retrieved successfully' })
  async getReviews(
    @Param('id') id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.contractorsService.getReviews(id, page, limit);
    return {
      success: true,
      data: result.data,
      meta: result.meta,
    };
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get contractor statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStats(@Param('id') id: string) {
    const stats = await this.contractorsService.getStats(id);
    return {
      success: true,
      data: stats,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update contractor profile' })
  @ApiResponse({ status: 200, description: 'Contractor profile updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Contractor not found' })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateContractorDto: UpdateContractorDto,
  ) {
    const contractor = await this.contractorsService.update(id, user.userId, updateContractorDto);
    return {
      success: true,
      data: contractor,
      message: 'Contractor profile updated successfully',
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete contractor profile' })
  @ApiResponse({ status: 200, description: 'Contractor profile deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Contractor not found' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    const result = await this.contractorsService.remove(id, user.userId);
    return {
      success: true,
      message: result.message,
    };
  }

  @Patch(':id/verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify contractor (Admin only)' })
  @ApiResponse({ status: 200, description: 'Contractor verified successfully' })
  async verifyContractor(@Param('id') id: string) {
    const contractor = await this.contractorsService.verifyContractor(id);
    return {
      success: true,
      data: contractor,
      message: 'Contractor verified successfully',
    };
  }

  @Patch(':id/suspend')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Suspend contractor (Admin only)' })
  @ApiResponse({ status: 200, description: 'Contractor suspended successfully' })
  async suspendContractor(@Param('id') id: string) {
    const contractor = await this.contractorsService.suspendContractor(id);
    return {
      success: true,
      data: contractor,
      message: 'Contractor suspended successfully',
    };
  }

  @Post(':id/rate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rate a contractor' })
  @ApiResponse({ status: 201, description: 'Rating submitted successfully' })
  async rateContractor(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() rateDto: RateContractorDto,
  ) {
    const review = await this.contractorsService.rateContractor(id, user.userId, rateDto);
    return {
      success: true,
      data: review,
      message: 'Rating submitted successfully',
    };
  }
}
