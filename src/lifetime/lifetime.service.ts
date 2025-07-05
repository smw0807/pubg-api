import { PubgService } from '@/pubg/pubg.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LifetimeService {
  constructor(private readonly pubgService: PubgService) {}

  /**
   * 404 에러 발생하는데 이유를 모르겠음
   */
  // players/{accountId}/seasons/lifetime
  // /seasons/lifetime/gameMode/{gameMode}/players
  async getLifetimeStats(accountId: string) {
    // const requestUrl = `players/${accountId}/seasons/lifetime`;
    const requestUrl = `seasons/lifetime/gameMode/squad/players?filter[playerIds]=${accountId}`;
    const stats = await this.pubgService.GET({
      requestUrl,
    });
    return stats;
  }
}
