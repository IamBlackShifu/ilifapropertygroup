import { IsString, IsEnum, IsNumber, IsArray, Min, IsOptional, IsBoolean, IsObject } from 'class-validator';
import { ProductCategory } from '@prisma/client';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(ProductCategory)
  category: ProductCategory;

  @IsString()
  unit: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stockQuantity?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  minOrderQty?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imageUrls?: string[];

  @IsObject()
  @IsOptional()
  specifications?: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}
