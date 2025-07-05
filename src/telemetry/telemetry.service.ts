import { Injectable } from '@nestjs/common';
import { PubgService } from '@/pubg/pubg.service';
import { MatchesService } from '@/matches/matches.service';
import { PlatformType } from '@/constants/platform';
import { format } from 'date-fns';

@Injectable()
export class TelemetryService {
  constructor(
    private readonly pubgService: PubgService,
    private readonly matchesService: MatchesService,
  ) {}

  async getTelemetry(platform: PlatformType, matchId: string) {
    console.log(platform, matchId);
    const match = await this.matchesService.getMatches(platform, matchId);
    const matchDate = match.data.attributes.createdAt;
    console.log(matchDate);
    const formattedDate = format(new Date(matchDate), 'yyyy/MM/dd/HH/mm');

    const res = await this.pubgService.GETTelemetry({
      matchDate: formattedDate,
      matchId,
    });
    console.log(res);
  }
}
