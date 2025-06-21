import { PubgService } from '@pubg/pubg.service';
import { Injectable } from '@nestjs/common';
import { Player, PlayerDataItem } from '@models/players';

@Injectable()
export class PlayersService {
  constructor(private readonly pubgService: PubgService) {}

  async getPlayers(): Promise<PlayerDataItem> {
    const response = await this.pubgService.req<Player>(
      'GET',
      'kakao',
      'players?filter[playerNames]=wait_plz_bro1',
    );
    return response.data[0];
  }
}
