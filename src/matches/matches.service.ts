import { PlatformType } from '@/constants/platform';
import { PubgService } from '@/pubg/pubg.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MatchesService {
  constructor(private readonly pubgService: PubgService) {}

  async getMatches(platform: PlatformType, matchId: string) {
    const requestUrl = `matches/${matchId}`;
    const matches = await this.pubgService.req({
      method: 'GET',
      platform,
      requestUrl,
    });
    return matches;
  }
}
