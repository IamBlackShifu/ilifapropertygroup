import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { TrackPageViewDto } from './dto/track-page-view.dto';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('page-view')
  @HttpCode(202)
  @ApiOperation({ summary: 'Record a consented anonymous page view' })
  trackPageView(@Body() input: TrackPageViewDto) {
    return this.analyticsService.trackPageView(input);
  }
}
