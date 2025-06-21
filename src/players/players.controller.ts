import { Controller, Get, Query } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayerDataItem } from '@/models/players';
import { PlatformType } from '@constants/platform';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  @ApiOperation({
    summary: '플랫폼 및 닉네임을 기반으로 플레이어 정보를 조회합니다.',
  })
  @ApiQuery({
    name: 'platform',
    description: '플랫폼 타입',
    example: 'kakao',
    required: true,
  })
  @ApiQuery({ name: 'nickname', description: '닉네임', required: true })
  async getPlayers(
    @Query('platform') platform: PlatformType,
    @Query('nickname') nickname: string,
  ): Promise<PlayerDataItem> {
    return this.playersService.getPlayers(platform, nickname);
  }
}
