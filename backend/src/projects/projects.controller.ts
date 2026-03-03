import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CreateProjectWithMilestonesDto, CreateContractDto, SignContractDto } from './dto/create-contract.dto';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a project with milestones' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  async createProject(@CurrentUser() user: any, @Body() dto: CreateProjectWithMilestonesDto) {
    const project = await this.projectsService.createProjectWithMilestones(user.userId, dto);
    return {
      success: true,
      data: project,
      message: 'Project created successfully',
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user\'s projects' })
  async getUserProjects(@CurrentUser() user: any) {
    const projects = await this.projectsService.getUserProjects(user.userId);
    return {
      success: true,
      data: projects,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get project by ID' })
  async getProject(@Param('id') id: string) {
    const project = await this.projectsService.getProjectById(id);
    return {
      success: true,
      data: project,
    };
  }

  @Get(':id/milestones')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get project milestones' })
  async getProjectMilestones(@Param('id') id: string) {
    const milestones = await this.projectsService.getProjectMilestones(id);
    return {
      success: true,
      data: milestones,
    };
  }

  @Patch('milestones/:id/complete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark milestone as completed' })
  async completeMilestone(@CurrentUser() user: any, @Param('id') id: string) {
    const milestone = await this.projectsService.completeMilestone(id, user.userId);
    return {
      success: true,
      data: milestone,
      message: 'Milestone completed',
    };
  }

  // Contract endpoints
  @Post('contracts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a contract' })
  @ApiResponse({ status: 201, description: 'Contract created successfully' })
  async createContract(@CurrentUser() user: any, @Body() dto: CreateContractDto) {
    const contract = await this.projectsService.createContract(user.userId, dto);
    return {
      success: true,
      data: contract,
      message: 'Contract created successfully',
    };
  }

  @Get('contracts/my-contracts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user\'s contracts' })
  async getUserContracts(
    @CurrentUser() user: any,
    @Query('role') role: 'client' | 'contractor' = 'client',
  ) {
    const contracts = await this.projectsService.getUserContracts(user.userId, role);
    return {
      success: true,
      data: contracts,
    };
  }

  @Get('contracts/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get contract by ID' })
  async getContract(@Param('id') id: string) {
    const contract = await this.projectsService.getContract(id);
    return {
      success: true,
      data: contract,
    };
  }

  @Patch('contracts/:id/sign')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sign a contract' })
  async signContract(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: SignContractDto,
  ) {
    const contract = await this.projectsService.signContract(user.userId, id, dto.signatureType);
    return {
      success: true,
      data: contract,
      message: 'Contract signed successfully',
    };
  }
}
