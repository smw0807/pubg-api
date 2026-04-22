import { PubgService } from 'pubg-kit/nestjs';
import { Injectable } from '@nestjs/common';
import { PlatformType } from '@constants/platform';
import type { Player } from 'pubg-kit'
@Injectable()
export class PlayersService {
  constructor(private readonly pubgService: PubgService) { }

  async getPlayers(
    platform: PlatformType,
    playerName: string,
  ): Promise<Player> {
    const response = await this.pubgService.shard(platform).players.getByNames([playerName]);
    return response[0];
  }
}
