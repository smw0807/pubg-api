import { PlatformType } from '@/constants/platform';
import { NormalStats } from '@/models/normalStats';
import { RankStats } from '@/models/rankStats';
import { PlayersService } from '@/players/players.service';
import { PubgService } from '@/pubg/pubg.service';
import { SeasonsService } from '@/seasons/seasons.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StatsService {
  constructor(
    private readonly pubgService: PubgService,
    private readonly playersService: PlayersService,
    private readonly seasonsService: SeasonsService,
  ) {}

  // 랭크 스탯 조회
  async getRankStats(platform: PlatformType, nickname: string) {
    // 닉네임으로 플레이어 아이디 구하기
    const player = await this.playersService.getPlayers(platform, nickname);
    const playerId = player.id;

    // 현재 시즌 아이디 구하기
    const season = await this.seasonsService.getCurrentSeason(platform);
    const seasonId = season.id;

    // 현재 시즌 스탯 조회
    const requestUrl = `players/${playerId}/seasons/${seasonId}/ranked`;
    const stats = await this.pubgService.req<RankStats>(
      'GET',
      platform,
      requestUrl,
    );

    const allStats = stats.data.attributes.rankedGameModeStats.All;
    const squadStats = stats.data.attributes.rankedGameModeStats.squad;
    const squadFppStats =
      stats.data.attributes.rankedGameModeStats['squad-fpp'];

    return {
      all: allStats,
      squad: squadStats,
      squadFpp: squadFppStats,
    };
  }

  // 노말 스탯 조회
  async getNormalStats(platform: PlatformType, nickname: string) {
    // 닉네임으로 플레이어 아이디 구하기
    const player = await this.playersService.getPlayers(platform, nickname);
    const playerId = player.id;

    // 현재 시즌 아이디 구하기
    const season = await this.seasonsService.getCurrentSeason(platform);
    const seasonId = season.id;

    // 현재 시즌 스탯 조회
    const requestUrl = `players/${playerId}/seasons/${seasonId}`;
    const stats = await this.pubgService.req<NormalStats>(
      'GET',
      platform,
      requestUrl,
    );

    const duoStats = stats.data.attributes.gameModeStats.duo;
    const duoFppStats = stats.data.attributes.gameModeStats['duo-fpp'];
    const soloStats = stats.data.attributes.gameModeStats.solo;
    const soloFppStats = stats.data.attributes.gameModeStats['solo-fpp'];
    const squadStats = stats.data.attributes.gameModeStats.squad;
    const squadFppStats = stats.data.attributes.gameModeStats['squad-fpp'];

    return {
      duo: duoStats,
      duoFpp: duoFppStats,
      solo: soloStats,
      soloFpp: soloFppStats,
      squad: squadStats,
      squadFpp: squadFppStats,
    };
  }
}
