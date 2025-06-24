import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
} from '@nestjs/swagger';
import { PlayersService } from './players.service';
import { PlayerDataItem } from '@/models/players';
import { PlatformType } from '@/constants/platform';
import { PlayerDataResponseDto } from './dto/players.dto';

@ApiTags('players')
@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  @ApiOperation({
    summary: '플레이어 정보 조회',
    description: '플랫폼 및 닉네임을 기반으로 플레이어 정보를 조회합니다.',
  })
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
  @ApiOkResponse({
    description: '플레이어 정보 조회 성공',
    type: PlayerDataResponseDto,
  })
  async getPlayers(
    @Query('platform') platform: PlatformType,
    @Query('playerName') playerName: string,
  ): Promise<PlayerDataItem> {
    return this.playersService.getPlayers(platform, playerName);
  }
}
