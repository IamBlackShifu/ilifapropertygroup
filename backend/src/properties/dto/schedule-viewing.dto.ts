import { IsString, IsEmail, IsDateString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ScheduleViewingDto {
  @ApiProperty({ description: 'Property ID' })
  @IsUUID()
  propertyId: string;

  @ApiProperty({ description: 'Preferred viewing date' })
  @IsDateString()
  preferredDate: string;

  @ApiProperty({ description: 'Preferred viewing time (e.g., "10:00 AM" or "14:30")' })
  @IsString()
  preferredTime: string;

  @ApiProperty({ description: 'Contact person name' })
  @IsString()
  contactName: string;

  @ApiProperty({ description: 'Contact email' })
  @IsEmail()
  contactEmail: string;

  @ApiProperty({ description: 'Contact phone number' })
  @IsString()
  contactPhone: string;

  @ApiProperty({ description: 'Additional message or requirements', required: false })
  @IsString()
  @IsOptional()
  message?: string;
}
