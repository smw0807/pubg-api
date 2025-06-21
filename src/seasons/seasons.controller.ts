import { Controller, Get, Query } from '@nestjs/common';
import { SeasonsService } from './seasons.service';
import { PlatformType } from '@/constants/platform';

@Controller('seasons')
export class SeasonsController {
  constructor(private readonly seasonsService: SeasonsService) {}

  @Get()
  async getSeasons(@Query('platform') platform: PlatformType) {
    return this.seasonsService.getSeasons(platform);
  }
}
