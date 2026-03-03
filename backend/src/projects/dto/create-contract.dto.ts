import { IsString, IsNotEmpty, IsNumber, IsArray, IsOptional, IsUUID, IsDateString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContractDto {
  @ApiProperty({ description: 'Project ID' })
  @IsUUID()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({ description: 'Contractor ID' })
  @IsUUID()
  @IsNotEmpty()
  contractorId: string;

  @ApiProperty({ description: 'Client ID' })
  @IsUUID()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({ description: 'Contract title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Contract description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Scope of work' })
  @IsString()
  @IsNotEmpty()
  scope: string;

  @ApiProperty({ description: 'Terms and conditions' })
  @IsString()
  @IsNotEmpty()
  terms: string;

  @ApiProperty({ description: 'Start date' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ description: 'End date' })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({ description: 'Total contract amount' })
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @ApiProperty({ description: 'Currency' })
  @IsString()
  @IsOptional()
  currency?: string;
}

export class MilestoneDto {
  @ApiProperty({ description: 'Milestone title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Milestone description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Milestone amount' })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Due date' })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiProperty({ description: 'Order/sequence' })
  @IsNumber()
  @Min(1)
  order: number;
}

export class CreateProjectWithMilestonesDto {
  @ApiProperty({ description: 'Project name' })
  @IsString()
  @IsNotEmpty()
  projectName: string;

  @ApiProperty({ description: 'Property ID (optional)' })
  @IsUUID()
  @IsOptional()
  propertyId?: string;

  @ApiProperty({ description: 'Project type' })
  @IsString()
  @IsNotEmpty()
  projectType: string;

  @ApiProperty({ description: 'Description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Total budget' })
  @IsNumber()
  @Min(0)
  budget: number;

  @ApiProperty({ description: 'Start date' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ description: 'Expected end date' })
  @IsDateString()
  @IsOptional()
  expectedEndDate?: string;

  @ApiProperty({ description: 'Milestones', type: [MilestoneDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MilestoneDto)
  milestones: MilestoneDto[];
}

export class SignContractDto {
  @ApiProperty({ description: 'Signature type (client or contractor)' })
  @IsString()
  @IsNotEmpty()
  signatureType: 'client' | 'contractor';
}
