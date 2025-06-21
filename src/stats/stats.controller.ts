import { Controller, Get, Query } from '@nestjs/common';
import { StatsService } from './stats.service';
import { PlatformType } from '@/constants/platform';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('rank')
  async getRankStats(
    @Query('platform') platform: PlatformType,
    @Query('nickname') nickname: string,
  ) {
    return this.statsService.getRankStats(platform, nickname);
  }
}
