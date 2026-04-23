import { PubgService } from 'pubg-kit/nestjs';
import { Injectable } from '@nestjs/common';
import type { PlatformShard } from 'pubg-kit';

@Injectable()
export class LifetimeService {
  constructor(private readonly pubgService: PubgService) { }

  async getLifetimeStats(platform: PlatformShard, accountId: string) {
    const stats = await this.pubgService.shard(platform).stats.getLifetimeStats(accountId);
    return stats;
  }
}
