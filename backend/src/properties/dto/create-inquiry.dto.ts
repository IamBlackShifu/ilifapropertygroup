import { IsString, IsNotEmpty, IsEmail, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInquiryDto {
  @ApiProperty({ description: 'Property ID' })
  @IsUUID()
  @IsNotEmpty()
  propertyId: string;

  @ApiProperty({ description: 'Inquirer name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Inquirer email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Inquirer phone' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: 'Inquiry message' })
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class RespondToInquiryDto {
  @ApiProperty({ description: 'Owner response to inquiry' })
  @IsString()
  @IsNotEmpty()
  ownerResponse: string;
}
