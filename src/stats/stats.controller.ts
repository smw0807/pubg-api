import { Controller, Get, Query } from '@nestjs/common';
import { StatsService } from './stats.service';
import { PlatformType } from '@/constants/platform';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('rank')
  @ApiOperation({ summary: '랭크 스탯 조회' })
  @ApiQuery({
    name: 'platform',
    type: String,
    example: 'kakao',
    required: true,
  })
  @ApiQuery({ name: 'nickname', type: String, required: true })
  async getRankStats(
    @Query('platform') platform: PlatformType,
    @Query('nickname') nickname: string,
  ) {
    return this.statsService.getRankStats(platform, nickname);
  }

  @Get('normal')
  @ApiOperation({ summary: '일반 스탯 조회' })
  @ApiQuery({
    name: 'platform',
    type: String,
    example: 'kakao',
    required: true,
  })
  @ApiQuery({ name: 'nickname', type: String, required: true })
  async getNormalStats(
    @Query('platform') platform: PlatformType,
    @Query('nickname') nickname: string,
  ) {
    return this.statsService.getNormalStats(platform, nickname);
  }
}
