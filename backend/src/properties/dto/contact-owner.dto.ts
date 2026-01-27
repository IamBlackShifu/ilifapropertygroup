import { IsString, IsEmail, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ContactOwnerDto {
  @ApiProperty({ description: 'Property ID' })
  @IsUUID()
  propertyId: string;

  @ApiProperty({ description: 'Sender name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Sender email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Sender phone number' })
  @IsString()
  phone: string;

  @ApiProperty({ description: 'Message to property owner' })
  @IsString()
  message: string;
}
