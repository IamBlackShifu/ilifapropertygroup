import { IsString, IsNotEmpty, IsNumber, IsArray, IsOptional, IsUUID, IsDateString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QuoteItemDto {
  @ApiProperty({ description: 'Item description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Quantity' })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Rate per unit' })
  @IsNumber()
  @Min(0)
  rate: number;

  @ApiProperty({ description: 'Total amount for this item' })
  @IsNumber()
  @Min(0)
  amount: number;
}

export class CreateQuoteDto {
  @ApiProperty({ description: 'Client user ID' })
  @IsUUID()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({ description: 'Service request ID (optional)' })
  @IsUUID()
  @IsOptional()
  serviceRequestId?: string;

  @ApiProperty({ description: 'Project ID (optional)' })
  @IsUUID()
  @IsOptional()
  projectId?: string;

  @ApiProperty({ description: 'Quote title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Quote description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Quote items', type: [QuoteItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuoteItemDto)
  items: QuoteItemDto[];

  @ApiProperty({ description: 'Tax percentage (0-100)' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  taxPercentage?: number;

  @ApiProperty({ description: 'Valid until date' })
  @IsDateString()
  @IsNotEmpty()
  validUntil: string;

  @ApiProperty({ description: 'Payment terms' })
  @IsString()
  @IsOptional()
  paymentTerms?: string;

  @ApiProperty({ description: 'Additional notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateQuoteDto {
  @ApiProperty({ description: 'Quote title' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'Quote description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Quote items', type: [QuoteItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuoteItemDto)
  @IsOptional()
  items?: QuoteItemDto[];

  @ApiProperty({ description: 'Tax percentage' })
  @IsNumber()
  @IsOptional()
  taxPercentage?: number;

  @ApiProperty({ description: 'Valid until date' })
  @IsDateString()
  @IsOptional()
  validUntil?: string;

  @ApiProperty({ description: 'Payment terms' })
  @IsString()
  @IsOptional()
  paymentTerms?: string;

  @ApiProperty({ description: 'Additional notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class RejectQuoteDto {
  @ApiProperty({ description: 'Reason for rejection' })
  @IsString()
  @IsNotEmpty()
  rejectionReason: string;
}
