import { IsIn, IsOptional, IsString, IsUUID, MaxLength, Matches } from 'class-validator';

export class TrackPageViewDto {
  @IsUUID()
  id: string;

  @IsUUID()
  visitorId: string;

  @IsUUID()
  sessionId: string;

  @IsString()
  @MaxLength(500)
  @Matches(/^\//, { message: 'path must be a relative site path' })
  path: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  referrer?: string;

  @IsIn(['desktop', 'mobile', 'tablet'])
  deviceType: 'desktop' | 'mobile' | 'tablet';
}
