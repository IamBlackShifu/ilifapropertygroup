import { IsString, IsOptional, IsEnum, IsDateString, IsDecimal, IsUUID } from 'class-validator';

export class CreateServiceRequestDto {
  @IsUUID()
  contractorId: string;

  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @IsString()
  serviceType: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(['URGENT', 'NORMAL', 'LOW'])
  urgency?: string;

  @IsOptional()
  @IsDateString()
  preferredDate?: string;

  @IsOptional()
  @IsString()
  locationCity?: string;

  @IsOptional()
  @IsString()
  locationAddress?: string;

  @IsOptional()
  @IsDecimal()
  estimatedBudget?: number;
}

export class UpdateServiceRequestDto {
  @IsOptional()
  @IsEnum(['ACCEPTED', 'REJECTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
  status?: string;

  @IsOptional()
  @IsDecimal()
  quotedAmount?: number;

  @IsOptional()
  @IsString()
  contractorNotes?: string;

  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  completedDate?: string;
}
