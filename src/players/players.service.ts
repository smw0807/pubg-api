import { PubgService } from 'pubg-kit/nestjs';
import { Injectable } from '@nestjs/common';
import type { Player } from 'pubg-kit'
import type { PlatformShard } from 'pubg-kit'
@Injectable()
export class PlayersService {
  constructor(private readonly pubgService: PubgService) { }

  async getPlayers(
    platform: PlatformShard,
    playerName: string,
  ): Promise<Player> {
    const response = await this.pubgService.shard(platform).players.getByNames([playerName]);
    return response[0];
  }
}
