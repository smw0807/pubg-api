import { Injectable } from '@nestjs/common';;
import { PubgService } from 'pubg-kit/nestjs';
import type { PlatformShard } from 'pubg-kit'
import type { Season } from 'pubg-kit'
@Injectable()
export class SeasonsService {
  constructor(private readonly pubgService: PubgService) { }

  // 시즌 조회
  async getSeasons(platform: PlatformShard): Promise<Season[]> {
    const seasons = await this.pubgService.shard(platform).seasons.getAll();
    return seasons;

  }

  // 현재 시즌 조회
  async getCurrentSeason(platform: PlatformShard): Promise<Season> {
    const getSeasons = await this.getSeasons(platform);
    const currentSeason = getSeasons.filter(item => item.attributes.isCurrentSeason)
    return currentSeason[0];
  }
}
