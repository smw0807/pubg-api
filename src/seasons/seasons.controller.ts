import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
} from '@nestjs/swagger';
import { SeasonsService } from './seasons.service';
import { PlatformType } from '@/constants/platform';
import { SeasonData } from '@/models/seasons';
import {
  SeasonsListResponseDto,
  SeasonDataResponseDto,
} from './dto/seasons.dto';

@ApiTags('seasons')
@Controller('seasons')
export class SeasonsController {
  constructor(private readonly seasonsService: SeasonsService) {}

  @Get()
  @ApiOperation({
    summary: '시즌 목록 조회',
    description: '플랫폼의 모든 시즌 정보를 조회합니다.',
  })
  @ApiQuery({
    name: 'platform',
    description: '플랫폼 타입',
    enum: ['steam', 'kakao'],
    example: 'kakao',
    required: true,
  })
  @ApiOkResponse({
    description: '시즌 목록 조회 성공',
    type: SeasonsListResponseDto,
  })
  async getSeasons(@Query('platform') platform: PlatformType) {
    return this.seasonsService.getSeasons(platform);
  }

  @Get('current')
  @ApiOperation({
    summary: '현재 시즌 정보 조회',
    description: '플랫폼의 현재 시즌 정보를 조회합니다.',
  })
  @ApiQuery({
    name: 'platform',
    description: '플랫폼 타입',
    enum: ['steam', 'kakao'],
    example: 'kakao',
    required: true,
  })
  @ApiOkResponse({
    description: '현재 시즌 정보 조회 성공',
    type: SeasonDataResponseDto,
  })
  async getCurrentSeason(
    @Query('platform') platform: PlatformType,
  ): Promise<SeasonData> {
    return this.seasonsService.getCurrentSeason(platform);
  }
}
