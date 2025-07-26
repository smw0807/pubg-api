import { Controller, Get, Query } from '@nestjs/common';
import { LifetimeService } from './lifetime.service';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PlatformType } from '@/constants/platform';

@Controller('lifetime')
export class LifetimeController {
  constructor(private readonly lifetimeService: LifetimeService) {}

  @Get('stats')
  @ApiOperation({
    summary: '라이프타임 스탯 조회',
    description: '모든 시즌 통틀어서 라이프타임 스탯을 조회합니다.',
  })
  @ApiQuery({
    name: 'platform',
    description: '플랫폼 타입',
    enum: ['steam', 'kakao'],
    example: 'kakao',
    required: true,
  })
  @ApiQuery({
    name: 'accountId',
    type: String,
    example: 'account.1234567890',
    required: true,
  })
  async getLifetimeStats(
    @Query('platform') platform: PlatformType,
    @Query('accountId') accountId: string,
  ) {
    return this.lifetimeService.getLifetimeStats(platform, accountId);
  }
}
