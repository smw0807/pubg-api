import { Controller, Get, Query } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { PlatformType } from '@/constants/platform';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  async getMatches(
    @Query('platform') platform: PlatformType,
    @Query('matchId') matchId: string,
  ) {
    return this.matchesService.getMatches(platform, matchId);
  }
}
