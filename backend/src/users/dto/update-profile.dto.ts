import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional({ description: 'Real estate agency or company name' })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  companyName?: string;

  @ApiPropertyOptional({ description: 'Uploaded company logo path or URL' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  companyLogoUrl?: string;

  @ApiPropertyOptional({ description: 'Professional or agency registration number' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  agentRegistrationNumber?: string;
}
