import { Injectable } from '@nestjs/common';;
import { PlatformType } from '@constants/platform';
import { PubgService } from 'pubg-kit/nestjs';
import type { Season } from 'pubg-kit'
@Injectable()
export class SeasonsService {
  constructor(private readonly pubgService: PubgService) { }

  // 시즌 조회
  async getSeasons(platform: PlatformType): Promise<Season[]> {
    const seasons = await this.pubgService.shard(platform).seasons.getAll();
    return seasons;

  }

  // 현재 시즌 조회
  async getCurrentSeason(platform: PlatformType): Promise<Season> {
    const getSeasons = await this.getSeasons(platform);
    const currentSeason = getSeasons.filter(item => item.attributes.isCurrentSeason)
    return currentSeason[0];
  }
}
