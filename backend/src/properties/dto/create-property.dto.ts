import { IsString, IsEnum, IsNumber, IsOptional, Min, IsBoolean, IsArray, IsDecimal } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PropertyType } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreatePropertyDto {
  @ApiProperty({ example: 'Beautiful 3 Bedroom House in Borrowdale' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Spacious family home with modern amenities...' })
  @IsString()
  description: string;

  @ApiProperty({ example: PropertyType.HOUSE, enum: PropertyType })
  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @ApiProperty({ example: 250000 })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  price: number;

  @ApiProperty({ example: 'USD', default: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ example: 'Harare' })
  @IsString()
  locationCity: string;

  @ApiProperty({ example: 'Borrowdale', required: false })
  @IsOptional()
  @IsString()
  locationArea?: string;

  @ApiProperty({ example: '123 Main Street', required: false })
  @IsOptional()
  @IsString()
  locationAddress?: string;

  @ApiProperty({ example: -17.8252, required: false })
  @IsOptional()
  @Type(() => Number)
  coordinatesLat?: number;

  @ApiProperty({ example: 31.0335, required: false })
  @IsOptional()
  @Type(() => Number)
  coordinatesLng?: number;

  @ApiProperty({ example: 500, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  sizeSqm?: number;

  @ApiProperty({ example: 3, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  bedrooms?: number;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  bathrooms?: number;

  @ApiProperty({ example: ['https://example.com/image1.jpg'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
