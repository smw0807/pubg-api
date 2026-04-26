import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { MasteryService } from "./mastery.service";
import { PlatformShard } from "pubg-kit";
import { PlayersService } from "@/players/players.service";

@ApiTags('mastery')
@Controller('mastery')
export class MasteryController {
  constructor(private readonly masteryService: MasteryService, private readonly playersService: PlayersService) { }

  @Get('weapon')
  @ApiOperation({
    summary: '무기 마스터리 조회',
    description: '무기 마스터리를 조회합니다.',
  })
  @ApiQuery({
    name: 'platform',
    description: '플랫폼 타입',
    enum: ['steam', 'kakao'],
    example: 'kakao',
  })
  @ApiQuery({
    name: 'playerName',
    description: '플레이어 닉네임',
    example: 'PlayerName123',
  })
  async getWeaponMastery(
    @Query('platform') platform: PlatformShard,
    @Query('playerName') playerName: string,
  ) {
    const player = await this.playersService.getPlayers(platform, playerName);
    const accountId = player.id;
    return this.masteryService.getWeaponMastery(platform, accountId);
  }

  @Get('survival')
  @ApiOperation({
    summary: '생존 마스터리 조회',
    description: '생존 마스터리를 조회합니다.',
  })
  @ApiQuery({
    name: 'platform',
    description: '플랫폼 타입',
    enum: ['steam', 'kakao'],
    example: 'kakao',
  })
  @ApiQuery({
    name: 'playerName',
    description: '플레이어 닉네임',
    example: 'PlayerName123',
  })
  async getSurvivalMastery(
    @Query('platform') platform: PlatformShard,
    @Query('playerName') playerName: string,
  ) {
    const player = await this.playersService.getPlayers(platform, playerName);
    const accountId = player.id;
    return this.masteryService.getSurvivalMastery(platform, accountId);
  }
}