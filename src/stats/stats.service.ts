import { PlatformType } from '@/constants/platform';
import { MatchesService } from '@/matches/matches.service';
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
    private readonly matchesService: MatchesService,
  ) {}

  // 랭크 스탯 조회
  async getRankStats(platform: PlatformType, playerName: string) {
    // 닉네임으로 플레이어 아이디 구하기
    const player = await this.playersService.getPlayers(platform, playerName);
    const playerId = player.id;
    const banType = player.attributes.banType;

    // 현재 시즌 아이디 구하기
    const season = await this.seasonsService.getCurrentSeason(platform);
    const seasonId = season.id;

    // 현재 시즌 스탯 조회
    const requestUrl = `players/${playerId}/seasons/${seasonId}/ranked`;
    const stats = await this.pubgService.GET<RankStats>({
      platform,
      requestUrl,
    });

    const allStats = stats.data.attributes.rankedGameModeStats.All;
    const duoStats = stats.data.attributes.rankedGameModeStats.duo;
    const squadStats = stats.data.attributes.rankedGameModeStats.squad;
    const squadFppStats =
      stats.data.attributes.rankedGameModeStats['squad-fpp'];

    return {
      all: allStats,
      duo: duoStats,
      squad: squadStats,
      squadFpp: squadFppStats,
      banType,
    };
  }

  // 노말 스탯 조회
  async getNormalStats(platform: PlatformType, playerName: string) {
    // 닉네임으로 플레이어 아이디 구하기
    const player = await this.playersService.getPlayers(platform, playerName);
    const playerId = player.id;
    const banType = player.attributes.banType;

    // 현재 시즌 아이디 구하기
    const season = await this.seasonsService.getCurrentSeason(platform);
    const seasonId = season.id;

    // 현재 시즌 스탯 조회
    const requestUrl = `players/${playerId}/seasons/${seasonId}`;
    const stats = await this.pubgService.GET<NormalStats>({
      platform,
      requestUrl,
    });

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
      banType,
    };
  }

  // 최근 매치 스탯 조회
  async getRecentMatchStats(platform: PlatformType, playerName: string) {
    // 닉네임으로 플레이어 아이디 구하기
    const player = await this.playersService.getPlayers(platform, playerName);

    const matches = player.relationships.matches.data.map(v => v.id);
    const matchStats = await Promise.all(
      matches.map(matchId =>
        this.matchesService.getPlayerMatchStats(platform, matchId, playerName),
      ),
    );
    return matchStats;
  }
}
