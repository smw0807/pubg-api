import { Controller, Get, Query } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';
import { PlatformType } from '@/constants/platform';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('telemetry')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Get('match/:matchId')
  @ApiOperation({ summary: 'Telemetry 정보 조회' })
  @ApiQuery({
    name: 'platform',
    description: '플랫폼 타입',
    enum: ['steam', 'kakao'],
    example: 'steam',
  })
  @ApiQuery({
    name: 'matchId',
    description: '매치 ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  async getTelemetry(
    @Query('platform') platform: PlatformType,
    @Query('matchId') matchId: string,
  ) {
    return this.telemetryService.getTelemetry(platform, matchId);
  }
}
