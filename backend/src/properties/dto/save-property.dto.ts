import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SavePropertyDto {
  @ApiProperty({ description: 'Property ID to save' })
  @IsUUID()
  propertyId: string;

  @ApiProperty({ description: 'Optional notes about this property', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
