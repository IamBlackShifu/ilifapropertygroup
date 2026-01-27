import { IsString, IsEnum, IsOptional, IsBoolean, IsNumber, IsArray, Min, IsUrl, IsEmail } from 'class-validator';
import { ProductCategory } from '@prisma/client';

export class CreateSupplierDto {
  @IsString()
  companyName: string;

  @IsString()
  @IsOptional()
  registrationNumber?: string;

  @IsString()
  description: string;

  @IsArray()
  @IsEnum(ProductCategory, { each: true })
  categories: ProductCategory[];

  @IsNumber()
  @IsOptional()
  @Min(0)
  yearsInBusiness?: number;

  @IsString()
  city: string;

  @IsString()
  address: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsUrl()
  @IsOptional()
  website?: string;

  @IsBoolean()
  @IsOptional()
  deliveryAvailable?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(0)
  deliveryRadius?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  minOrderAmount?: number;
}
