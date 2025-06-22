import { PubgService } from '@/pubg/pubg.service';
import { Injectable } from '@nestjs/common';
import { Season, SeasonData } from '@models/seasons';
import { PlatformType } from '@constants/platform';

@Injectable()
export class SeasonsService {
  constructor(private readonly pubgService: PubgService) {}

  // 시즌 조회
  async getSeasons(platform: PlatformType): Promise<SeasonData[]> {
    const response = await this.pubgService.req<Season>({
      method: 'GET',
      platform,
      requestUrl: 'seasons',
    });
    return response.data;
  }

  // 현재 시즌 조회
  async getCurrentSeason(platform: PlatformType): Promise<SeasonData> {
    const response = await this.pubgService.req<Season>({
      method: 'GET',
      platform,
      requestUrl: 'seasons',
    });
    return response.data.filter(item => item.attributes.isCurrentSeason)[0];
  }
}
