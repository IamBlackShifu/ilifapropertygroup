import { IsString, IsArray, IsOptional, IsInt, Min, Max, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ContractorStatus } from '@prisma/client';

export class CreateContractorDto {
  @ApiProperty({ example: 'BuildPro Construction Ltd' })
  @IsString()
  companyName: string;

  @ApiProperty({ example: 'REG123456', required: false })
  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @ApiProperty({ example: 'Professional construction services with over 10 years experience' })
  @IsString()
  description: string;

  @ApiProperty({ example: ['Plumbing', 'Electrical', 'Roofing'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  servicesOffered: string[];

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  yearsExperience?: number;

  @ApiProperty({ example: 25, required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  employeesCount?: number;

  @ApiProperty({ example: 'Harare', required: false })
  @IsOptional()
  @IsString()
  locationCity?: string;

  @ApiProperty({ example: '123 Industrial Road, Workington', required: false })
  @IsOptional()
  @IsString()
  locationAddress?: string;
}

export class UpdateContractorDto {
  @ApiProperty({ example: 'BuildPro Construction Ltd', required: false })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({ example: 'REG123456', required: false })
  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @ApiProperty({ example: 'Professional construction services', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: ['Plumbing', 'Electrical'], required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  servicesOffered?: string[];

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  yearsExperience?: number;

  @ApiProperty({ example: 25, required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  employeesCount?: number;

  @ApiProperty({ example: 'Harare', required: false })
  @IsOptional()
  @IsString()
  locationCity?: string;

  @ApiProperty({ example: '123 Industrial Road', required: false })
  @IsOptional()
  @IsString()
  locationAddress?: string;
}

export class FilterContractorDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  service?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  locationCity?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(ContractorStatus)
  status?: ContractorStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minRating?: number;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiProperty({ required: false, default: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({ required: false, default: 'desc', enum: ['asc', 'desc'] })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}

export class RateContractorDto {
  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'Excellent service, highly recommend!' })
  @IsString()
  comment: string;

  @ApiProperty({ example: 'project-id-123', required: false })
  @IsOptional()
  @IsString()
  projectId?: string;
}
