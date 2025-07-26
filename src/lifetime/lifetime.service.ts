import { PlatformType } from '@/constants/platform';
import { PubgService } from '@/pubg/pubg.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LifetimeService {
  constructor(private readonly pubgService: PubgService) {}

  async getLifetimeStats(platform: PlatformType, accountId: string) {
    const requestUrl = `${platform}/players/${accountId}/seasons/lifetime?filter[gamepad]=false`;
    const stats = await this.pubgService.GET({
      requestUrl,
    });
    return stats;
  }
}
