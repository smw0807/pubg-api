import { PubgService } from '@pubg/pubg.service';
import { Injectable } from '@nestjs/common';
import { Player, PlayerDataItem } from '@models/players';
import { PlatformType } from '@constants/platform';
@Injectable()
export class PlayersService {
  constructor(private readonly pubgService: PubgService) {}

  async getPlayers(
    platform: PlatformType,
    nickname: string,
  ): Promise<PlayerDataItem> {
    const response = await this.pubgService.GET<Player>({
      platform,
      requestUrl: `players?filter[playerNames]=${nickname}`,
    });
    return response.data[0];
  }
}
