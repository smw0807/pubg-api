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
  @ApiQuery({ name: 'playerName', type: String, required: true })
  async getRankStats(
    @Query('platform') platform: PlatformType,
    @Query('playerName') playerName: string,
  ) {
    return this.statsService.getRankStats(platform, playerName);
  }

  @Get('normal')
  @ApiOperation({ summary: '일반 스탯 조회' })
  @ApiQuery({
    name: 'platform',
    type: String,
    example: 'kakao',
    required: true,
  })
  @ApiQuery({ name: 'playerName', type: String, required: true })
  async getNormalStats(
    @Query('platform') platform: PlatformType,
    @Query('playerName') playerName: string,
  ) {
    return this.statsService.getNormalStats(platform, playerName);
  }

  @Get('recent')
  @ApiOperation({ summary: '최근 매치 스탯 조회' })
  @ApiQuery({
    name: 'platform',
    description: '플랫폼 타입',
    enum: ['steam', 'kakao'],
    example: 'kakao',
    required: true,
  })
  @ApiQuery({
    name: 'playerName',
    description: '플레이어 닉네임',
    example: 'PlayerName123',
    required: true,
  })
  async getRecentMatchStats(
    @Query('platform') platform: PlatformType,
    @Query('playerName') playerName: string,
  ) {
    return this.statsService.getRecentMatchStats(platform, playerName);
  }
}
