import { Controller, Get, Query } from '@nestjs/common';
import { SeasonsService } from './seasons.service';
import { PlatformType } from '@/constants/platform';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SeasonData } from '@/models/seasons';

@Controller('seasons')
export class SeasonsController {
  constructor(private readonly seasonsService: SeasonsService) {}

  @Get()
  @ApiOperation({
    summary: '시즌 정보를 조회합니다.',
  })
  @ApiQuery({
    name: 'platform',
    description: '플랫폼 타입',
    example: 'kakao',
    required: true,
  })
  async getSeasons(@Query('platform') platform: PlatformType) {
    return this.seasonsService.getSeasons(platform);
  }

  @Get('current')
  @ApiOperation({
    summary: '현재 시즌 정보를 조회합니다.',
  })
  @ApiQuery({
    name: 'platform',
    description: '플랫폼 타입',
    example: 'kakao',
    required: true,
  })
  async getCurrentSeason(
    @Query('platform') platform: PlatformType,
  ): Promise<SeasonData> {
    return this.seasonsService.getCurrentSeason(platform);
  }
}
