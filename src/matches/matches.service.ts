import { PlatformType } from '@/constants/platform';
import { PubgService } from '@/pubg/pubg.service';
import { Injectable } from '@nestjs/common';
import { MatchResponse, Participant, Roster } from '@/models/matches';

@Injectable()
export class MatchesService {
  constructor(private readonly pubgService: PubgService) {}

  async getMatches(platform: PlatformType, matchId: string) {
    const requestUrl = `matches/${matchId}`;
    const matches = await this.pubgService.GET({
      platform,
      requestUrl,
    });
    return matches;
  }

  // 매치 요약 정보 반환
  async getMatchSummary(platform: PlatformType, matchId: string) {
    const matchData = (await this.getMatches(
      platform,
      matchId,
    )) as MatchResponse;

    const participants = this.getParticipants(matchData);
    const rosters = this.getRosters(matchData);

    return {
      matchId: matchData.data.id,
      gameMode: matchData.data.attributes.gameMode,
      mapName: matchData.data.attributes.mapName,
      duration: matchData.data.attributes.duration,
      createdAt: matchData.data.attributes.createdAt,
      totalPlayers: participants.length,
      totalTeams: rosters.length,
      winner: rosters.find(roster => roster.attributes.won === 'true'),
      topKiller: this.getTopKiller(participants),
      matchStats: {
        totalKills: participants.reduce(
          (sum, p) => sum + p.attributes.stats.kills,
          0,
        ),
        totalDamage: participants.reduce(
          (sum, p) => sum + p.attributes.stats.damageDealt,
          0,
        ),
        totalDistance: participants.reduce(
          (sum, p) =>
            sum +
            p.attributes.stats.walkDistance +
            p.attributes.stats.rideDistance,
          0,
        ),
      },
    };
  }

  // 팀별 순위 정보 반환
  async getTeamRankings(platform: PlatformType, matchId: string) {
    const matchData = (await this.getMatches(
      platform,
      matchId,
    )) as MatchResponse;
    const rosters = this.getRosters(matchData);
    const participants = this.getParticipants(matchData);

    return rosters
      .map(roster => {
        const teamParticipants = this.getTeamParticipants(roster, participants);
        const teamStats = this.calculateTeamStats(teamParticipants);

        return {
          rank: roster.attributes.stats.rank,
          teamId: roster.attributes.stats.teamId,
          won: roster.attributes.won === 'true',
          participants: teamParticipants.map(p => ({
            name: p.attributes.stats.name,
            kills: p.attributes.stats.kills,
            damage: p.attributes.stats.damageDealt,
            survivalTime: p.attributes.stats.timeSurvived,
            winPlace: p.attributes.stats.winPlace,
          })),
          teamStats,
        };
      })
      .sort((a, b) => a.rank - b.rank);
  }

  // 플레이어별 상세 통계 반환
  async getPlayerStats(platform: PlatformType, matchId: string) {
    const matchData = (await this.getMatches(
      platform,
      matchId,
    )) as MatchResponse;
    const participants = this.getParticipants(matchData);

    return participants
      .map(participant => {
        const stats = participant.attributes.stats;
        return {
          name: stats.name,
          playerId: stats.playerId,
          kills: stats.kills,
          assists: stats.assists,
          damage: stats.damageDealt,
          headshotKills: stats.headshotKills,
          survivalTime: stats.timeSurvived,
          winPlace: stats.winPlace,
          killPlace: stats.killPlace,
          distance: {
            walk: stats.walkDistance,
            ride: stats.rideDistance,
            swim: stats.swimDistance,
            total: stats.walkDistance + stats.rideDistance + stats.swimDistance,
          },
          items: {
            boosts: stats.boosts,
            heals: stats.heals,
            weaponsAcquired: stats.weaponsAcquired,
          },
          performance: {
            killStreaks: stats.killStreaks,
            longestKill: stats.longestKill,
            revives: stats.revives,
            DBNOs: stats.DBNOs,
          },
        };
      })
      .sort((a, b) => a.winPlace - b.winPlace);
  }

  // 킬 순위별 정렬
  async getKillLeaderboard(platform: PlatformType, matchId: string) {
    const matchData = (await this.getMatches(
      platform,
      matchId,
    )) as MatchResponse;
    const participants = this.getParticipants(matchData);

    return participants
      .map(participant => ({
        name: participant.attributes.stats.name,
        kills: participant.attributes.stats.kills,
        damage: participant.attributes.stats.damageDealt,
        headshotKills: participant.attributes.stats.headshotKills,
        longestKill: participant.attributes.stats.longestKill,
        winPlace: participant.attributes.stats.winPlace,
      }))
      .sort((a, b) => b.kills - a.kills || b.damage - a.damage);
  }

  // 데미지 순위별 정렬
  async getDamageLeaderboard(platform: PlatformType, matchId: string) {
    const matchData = (await this.getMatches(
      platform,
      matchId,
    )) as MatchResponse;
    const participants = this.getParticipants(matchData);

    return participants
      .map(participant => ({
        name: participant.attributes.stats.name,
        damage: participant.attributes.stats.damageDealt,
        kills: participant.attributes.stats.kills,
        headshotKills: participant.attributes.stats.headshotKills,
        winPlace: participant.attributes.stats.winPlace,
      }))
      .sort((a, b) => b.damage - a.damage);
  }

  // 생존 시간 순위별 정렬
  async getSurvivalLeaderboard(platform: PlatformType, matchId: string) {
    const matchData = (await this.getMatches(
      platform,
      matchId,
    )) as MatchResponse;
    const participants = this.getParticipants(matchData);

    return participants
      .map(participant => ({
        name: participant.attributes.stats.name,
        survivalTime: participant.attributes.stats.timeSurvived,
        winPlace: participant.attributes.stats.winPlace,
        kills: participant.attributes.stats.kills,
        damage: participant.attributes.stats.damageDealt,
      }))
      .sort((a, b) => b.survivalTime - a.survivalTime);
  }

  // 특정 플레이어의 매치 통계
  async getPlayerMatchStats(
    platform: PlatformType,
    matchId: string,
    playerName: string,
  ) {
    const matchData = (await this.getMatches(
      platform,
      matchId,
    )) as MatchResponse;
    const participants = this.getParticipants(matchData);

    const player = participants.find(
      p => p.attributes.stats.name.toLowerCase() === playerName.toLowerCase(),
    );

    if (!player) {
      throw new Error(`Player ${playerName} not found in this match`);
    }

    const stats = player.attributes.stats;
    return {
      name: stats.name,
      playerId: stats.playerId,
      matchId: matchData.data.id,
      gameMode: matchData.data.attributes.gameMode,
      mapName: matchData.data.attributes.mapName,
      performance: {
        kills: stats.kills,
        assists: stats.assists,
        damage: stats.damageDealt,
        headshotKills: stats.headshotKills,
        killPlace: stats.killPlace,
        winPlace: stats.winPlace,
        survivalTime: stats.timeSurvived,
        killStreaks: stats.killStreaks,
        longestKill: stats.longestKill,
      },
      movement: {
        walkDistance: stats.walkDistance,
        rideDistance: stats.rideDistance,
        swimDistance: stats.swimDistance,
        totalDistance:
          stats.walkDistance + stats.rideDistance + stats.swimDistance,
      },
      items: {
        boosts: stats.boosts,
        heals: stats.heals,
        weaponsAcquired: stats.weaponsAcquired,
        vehicleDestroys: stats.vehicleDestroys,
      },
      team: {
        revives: stats.revives,
        DBNOs: stats.DBNOs,
        teamKills: stats.teamKills,
      },
    };
  }

  // 유틸리티 메서드들
  private getParticipants(matchData: MatchResponse): Participant[] {
    return matchData.included.filter(
      (item): item is Participant => item.type === 'participant',
    );
  }

  private getRosters(matchData: MatchResponse): Roster[] {
    return matchData.included.filter(
      (item): item is Roster => item.type === 'roster',
    );
  }

  private getTeamParticipants(
    roster: Roster,
    participants: Participant[],
  ): Participant[] {
    const participantIds = roster.relationships.participants.data.map(
      p => p.id,
    );
    return participants.filter(p => participantIds.includes(p.id));
  }

  private calculateTeamStats(teamParticipants: Participant[]) {
    return {
      totalKills: teamParticipants.reduce(
        (sum, p) => sum + p.attributes.stats.kills,
        0,
      ),
      totalDamage: teamParticipants.reduce(
        (sum, p) => sum + p.attributes.stats.damageDealt,
        0,
      ),
      totalSurvivalTime: teamParticipants.reduce(
        (sum, p) => sum + p.attributes.stats.timeSurvived,
        0,
      ),
      bestWinPlace: Math.min(
        ...teamParticipants.map(p => p.attributes.stats.winPlace),
      ),
      totalDistance: teamParticipants.reduce(
        (sum, p) =>
          sum +
          p.attributes.stats.walkDistance +
          p.attributes.stats.rideDistance,
        0,
      ),
    };
  }

  private getTopKiller(participants: Participant[]) {
    return participants.reduce((top, current) =>
      current.attributes.stats.kills > top.attributes.stats.kills
        ? current
        : top,
    );
  }

  // 추가 고급 분석 기능들

  // 팀별 상세 분석
  async getTeamAnalysis(platform: PlatformType, matchId: string) {
    const matchData = (await this.getMatches(
      platform,
      matchId,
    )) as MatchResponse;
    const rosters = this.getRosters(matchData);
    const participants = this.getParticipants(matchData);

    return rosters
      .map(roster => {
        const teamParticipants = this.getTeamParticipants(roster, participants);
        const teamStats = this.calculateTeamStats(teamParticipants);

        // 팀 내 최고 성과자들
        const topKiller = teamParticipants.reduce((top, current) =>
          current.attributes.stats.kills > top.attributes.stats.kills
            ? current
            : top,
        );

        const topDamage = teamParticipants.reduce((top, current) =>
          current.attributes.stats.damageDealt >
          top.attributes.stats.damageDealt
            ? current
            : top,
        );

        const topSurvivor = teamParticipants.reduce((top, current) =>
          current.attributes.stats.timeSurvived >
          top.attributes.stats.timeSurvived
            ? current
            : top,
        );

        return {
          rank: roster.attributes.stats.rank,
          teamId: roster.attributes.stats.teamId,
          won: roster.attributes.won === 'true',
          teamStats,
          topPerformers: {
            topKiller: {
              name: topKiller.attributes.stats.name,
              kills: topKiller.attributes.stats.kills,
              damage: topKiller.attributes.stats.damageDealt,
            },
            topDamage: {
              name: topDamage.attributes.stats.name,
              damage: topDamage.attributes.stats.damageDealt,
              kills: topDamage.attributes.stats.kills,
            },
            topSurvivor: {
              name: topSurvivor.attributes.stats.name,
              survivalTime: topSurvivor.attributes.stats.timeSurvived,
              winPlace: topSurvivor.attributes.stats.winPlace,
            },
          },
          teamEfficiency: {
            killsPerPlayer: teamStats.totalKills / teamParticipants.length,
            damagePerPlayer: teamStats.totalDamage / teamParticipants.length,
            survivalTimePerPlayer:
              teamStats.totalSurvivalTime / teamParticipants.length,
          },
        };
      })
      .sort((a, b) => a.rank - b.rank);
  }

  // 플레이어 성과 분석 (KDA, 효율성 등)
  async getPlayerPerformanceAnalysis(platform: PlatformType, matchId: string) {
    const matchData = (await this.getMatches(
      platform,
      matchId,
    )) as MatchResponse;
    const participants = this.getParticipants(matchData);

    return participants
      .map(participant => {
        const stats = participant.attributes.stats;
        const deaths = stats.deathType === 'alive' ? 0 : 1;
        const kda =
          deaths === 0
            ? stats.kills + stats.assists
            : (stats.kills + stats.assists) / deaths;
        const damagePerKill =
          stats.kills > 0 ? stats.damageDealt / stats.kills : 0;
        const survivalEfficiency =
          stats.timeSurvived / matchData.data.attributes.duration;
        const headshotAccuracy =
          stats.kills > 0 ? stats.headshotKills / stats.kills : 0;

        return {
          name: stats.name,
          playerId: stats.playerId,
          winPlace: stats.winPlace,
          performance: {
            kills: stats.kills,
            assists: stats.assists,
            deaths,
            kda: Math.round(kda * 100) / 100,
            damage: stats.damageDealt,
            damagePerKill: Math.round(damagePerKill * 100) / 100,
            headshotKills: stats.headshotKills,
            headshotAccuracy: Math.round(headshotAccuracy * 100) / 100,
            longestKill: stats.longestKill,
          },
          efficiency: {
            survivalTime: stats.timeSurvived,
            survivalEfficiency: Math.round(survivalEfficiency * 100) / 100,
            killStreaks: stats.killStreaks,
            revives: stats.revives,
            DBNOs: stats.DBNOs,
          },
          movement: {
            totalDistance:
              stats.walkDistance + stats.rideDistance + stats.swimDistance,
            walkDistance: stats.walkDistance,
            rideDistance: stats.rideDistance,
            swimDistance: stats.swimDistance,
          },
          items: {
            boosts: stats.boosts,
            heals: stats.heals,
            weaponsAcquired: stats.weaponsAcquired,
            vehicleDestroys: stats.vehicleDestroys,
          },
        };
      })
      .sort((a, b) => a.winPlace - b.winPlace);
  }

  // 매치 통계 요약
  async getMatchStatistics(platform: PlatformType, matchId: string) {
    const matchData = (await this.getMatches(
      platform,
      matchId,
    )) as MatchResponse;
    const participants = this.getParticipants(matchData);
    const rosters = this.getRosters(matchData);

    const totalKills = participants.reduce(
      (sum, p) => sum + p.attributes.stats.kills,
      0,
    );
    const totalDamage = participants.reduce(
      (sum, p) => sum + p.attributes.stats.damageDealt,
      0,
    );
    const totalHeadshots = participants.reduce(
      (sum, p) => sum + p.attributes.stats.headshotKills,
      0,
    );
    const totalDistance = participants.reduce(
      (sum, p) =>
        sum +
        p.attributes.stats.walkDistance +
        p.attributes.stats.rideDistance +
        p.attributes.stats.swimDistance,
      0,
    );

    const alivePlayers = participants.filter(
      p => p.attributes.stats.deathType === 'alive',
    ).length;
    const avgKills = totalKills / participants.length;
    const avgDamage = totalDamage / participants.length;
    const avgDistance = totalDistance / participants.length;

    return {
      matchId: matchData.data.id,
      gameMode: matchData.data.attributes.gameMode,
      mapName: matchData.data.attributes.mapName,
      duration: matchData.data.attributes.duration,
      playerCount: participants.length,
      teamCount: rosters.length,
      summary: {
        totalKills,
        totalDamage: Math.round(totalDamage * 100) / 100,
        totalHeadshots,
        totalDistance: Math.round(totalDistance * 100) / 100,
        alivePlayers,
      },
      averages: {
        avgKills: Math.round(avgKills * 100) / 100,
        avgDamage: Math.round(avgDamage * 100) / 100,
        avgDistance: Math.round(avgDistance * 100) / 100,
        headshotRate:
          totalKills > 0
            ? Math.round((totalHeadshots / totalKills) * 100) / 100
            : 0,
      },
      extremes: {
        mostKills: Math.max(...participants.map(p => p.attributes.stats.kills)),
        mostDamage: Math.max(
          ...participants.map(p => p.attributes.stats.damageDealt),
        ),
        longestKill: Math.max(
          ...participants.map(p => p.attributes.stats.longestKill),
        ),
        longestSurvival: Math.max(
          ...participants.map(p => p.attributes.stats.timeSurvived),
        ),
      },
    };
  }

  // 플레이어 검색 및 필터링
  async searchPlayers(
    platform: PlatformType,
    matchId: string,
    searchTerm: string,
  ) {
    const matchData = (await this.getMatches(
      platform,
      matchId,
    )) as MatchResponse;
    const participants = this.getParticipants(matchData);

    const filteredPlayers = participants.filter(participant =>
      participant.attributes.stats.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );

    return filteredPlayers.map(participant => ({
      name: participant.attributes.stats.name,
      playerId: participant.attributes.stats.playerId,
      kills: participant.attributes.stats.kills,
      damage: participant.attributes.stats.damageDealt,
      winPlace: participant.attributes.stats.winPlace,
      survivalTime: participant.attributes.stats.timeSurvived,
    }));
  }
}
