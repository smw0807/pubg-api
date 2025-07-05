import { Controller, Get, Query } from '@nestjs/common';
import { LifetimeService } from './lifetime.service';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('lifetime')
export class LifetimeController {
  constructor(private readonly lifetimeService: LifetimeService) {}

  @Get('stats')
  @ApiOperation({
    summary: '라이프타임 스탯 조회',
    description: '현재 미완성된 기능입니다.',
  })
  @ApiQuery({
    name: 'accountId',
    type: String,
    example: 'account.1234567890',
    required: true,
  })
  async getLifetimeStats(@Query('accountId') accountId: string) {
    return this.lifetimeService.getLifetimeStats(accountId);
  }
}
