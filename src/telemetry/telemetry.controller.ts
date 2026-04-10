import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TelemetryService } from './telemetry.service';
import { PlatformType } from '@/constants/platform';

@ApiTags('telemetry')
@Controller('telemetry')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Get('movement')
  @ApiOperation({
    summary: '플레이어 이동 경로 조회',
    description:
      '매치에서 발생한 플레이어 위치 로그를 조회합니다. playerName을 지정하면 특정 플레이어의 이동 경로만 반환합니다.',
  })
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
  @ApiQuery({
    name: 'playerName',
    description: '플레이어 이름 (생략 시 전체 플레이어)',
    required: false,
    example: 'PlayerName123',
  })
  async getMovementLog(
    @Query('platform') platform: PlatformType,
    @Query('matchId') matchId: string,
    @Query('playerName') playerName?: string,
  ) {
    return this.telemetryService.getMovementLog(platform, matchId, playerName);
  }

  @Get('kills')
  @ApiOperation({
    summary: '킬 로그 조회',
    description: '매치에서 발생한 킬 이벤트 목록을 조회합니다.',
  })
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
  async getKillLog(
    @Query('platform') platform: PlatformType,
    @Query('matchId') matchId: string,
  ) {
    return this.telemetryService.getKillLog(platform, matchId);
  }

  @Get('groggy')
  @ApiOperation({
    summary: '기절(DBNO) 로그 조회',
    description: '매치에서 발생한 기절(다운) 이벤트 목록을 조회합니다.',
  })
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
  async getGroggyLog(
    @Query('platform') platform: PlatformType,
    @Query('matchId') matchId: string,
  ) {
    return this.telemetryService.getGroggyLog(platform, matchId);
  }

  @Get('damage')
  @ApiOperation({
    summary: '데미지 로그 조회',
    description:
      '매치에서 발생한 데미지 이벤트 목록을 조회합니다. playerName을 지정하면 해당 플레이어가 주거나 받은 데미지만 반환합니다.',
  })
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
  @ApiQuery({
    name: 'playerName',
    description: '플레이어 이름 (생략 시 전체)',
    required: false,
    example: 'PlayerName123',
  })
  async getDamageLog(
    @Query('platform') platform: PlatformType,
    @Query('matchId') matchId: string,
    @Query('playerName') playerName?: string,
  ) {
    return this.telemetryService.getDamageLog(platform, matchId, playerName);
  }
}
