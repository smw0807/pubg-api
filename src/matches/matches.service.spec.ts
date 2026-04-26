import { Test, TestingModule } from '@nestjs/testing';
import { MatchesService } from './matches.service';
import { PubgService } from 'pubg-kit/nestjs';
import type { Participant, Roster, MatchResponse } from 'pubg-kit';

// ---- Factories ----
const createStats = (overrides: Partial<any> = {}) => ({
  name: 'Player1',
  playerId: 'account.player1',
  kills: 3,
  assists: 1,
  damageDealt: 300,
  headshotKills: 1,
  timeSurvived: 1000,
  winPlace: 5,
  killPlace: 10,
  walkDistance: 2000,
  rideDistance: 500,
  swimDistance: 100,
  boosts: 2,
  heals: 3,
  weaponsAcquired: 5,
  killStreaks: 1,
  longestKill: 120,
  revives: 0,
  DBNOs: 1,
  deathType: 'byplayer',
  teamKills: 0,
  vehicleDestroys: 0,
  ...overrides,
});

const createParticipant = (id: string, statsOverrides: Partial<any> = {}): Participant =>
  ({
    type: 'participant',
    id,
    attributes: { stats: createStats(statsOverrides) },
  } as unknown as Participant);

const createRoster = (id: string, participantIds: string[], rankOverrides: Partial<any> = {}): Roster =>
  ({
    type: 'roster',
    id,
    attributes: {
      stats: { rank: 1, teamId: 1, ...rankOverrides },
      won: rankOverrides.rank === 1 ? 'true' : 'false',
    },
    relationships: {
      participants: { data: participantIds.map(pid => ({ id: pid, type: 'participant' })) },
    },
  } as unknown as Roster);

const createMatchResponse = (participants: Participant[], rosters: Roster[]): MatchResponse =>
  ({
    data: {
      id: 'match-abc123',
      type: 'match',
      attributes: {
        gameMode: 'squad-fpp',
        mapName: 'Erangel_Main',
        duration: 1800,
        createdAt: '2024-01-01T00:00:00Z',
      },
    },
    included: [...participants, ...rosters],
  } as unknown as MatchResponse);

// ---- Mock setup ----
const mockShardResult = {
  matches: { get: jest.fn() },
};

const mockPubgService = {
  shard: jest.fn().mockReturnValue(mockShardResult),
};

describe('MatchesService', () => {
  let service: MatchesService;

  const p1 = createParticipant('p1', { name: 'Alpha', kills: 8, damageDealt: 800, timeSurvived: 1500, winPlace: 1, killPlace: 1, deathType: 'alive' });
  const p2 = createParticipant('p2', { name: 'Beta', kills: 5, damageDealt: 600, timeSurvived: 1200, winPlace: 2, killPlace: 3 });
  const p3 = createParticipant('p3', { name: 'Gamma', kills: 2, damageDealt: 400, timeSurvived: 900, winPlace: 3, killPlace: 5 });
  const r1 = createRoster('r1', ['p1'], { rank: 1, teamId: 1 });
  const r2 = createRoster('r2', ['p2', 'p3'], { rank: 2, teamId: 2 });
  const matchData = createMatchResponse([p1, p2, p3], [r1, r2]);

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchesService,
        { provide: PubgService, useValue: mockPubgService },
      ],
    }).compile();

    service = module.get<MatchesService>(MatchesService);
  });

  it('정의되어 있어야 한다', () => {
    expect(service).toBeDefined();
  });

  // ---- getMatches ----
  describe('getMatches', () => {
    it('매치 데이터를 반환해야 한다', async () => {
      mockShardResult.matches.get.mockResolvedValueOnce(matchData);

      const result = await service.getMatches('steam', 'match-abc123');

      expect(mockPubgService.shard).toHaveBeenCalledWith('steam');
      expect(mockShardResult.matches.get).toHaveBeenCalledWith('match-abc123');
      expect(result).toEqual(matchData);
    });

    it('API 실패 시 에러를 던져야 한다', async () => {
      mockShardResult.matches.get.mockRejectedValueOnce(new Error('Not Found'));

      await expect(service.getMatches('steam', 'bad-id')).rejects.toThrow('Not Found');
    });
  });

  // ---- getMatchSummary ----
  describe('getMatchSummary', () => {
    it('합계가 포함된 올바른 요약 정보를 반환해야 한다', async () => {
      mockShardResult.matches.get.mockResolvedValueOnce(matchData);

      const result = await service.getMatchSummary('steam', 'match-abc123');

      expect(result.matchId).toBe('match-abc123');
      expect(result.gameMode).toBe('squad-fpp');
      expect(result.mapName).toBe('Erangel_Main');
      expect(result.duration).toBe(1800);
      expect(result.totalPlayers).toBe(3);
      expect(result.totalTeams).toBe(2);
      expect(result.matchStats.totalKills).toBe(8 + 5 + 2);
      expect(result.matchStats.totalDamage).toBe(800 + 600 + 400);
    });

    it('우승 팀을 식별해야 한다', async () => {
      mockShardResult.matches.get.mockResolvedValueOnce(matchData);

      const result = await service.getMatchSummary('steam', 'match-abc123');

      expect(result.winner).toBeDefined();
      expect(result.winner?.attributes.won).toBe('true');
    });

    it('최다 킬 플레이어를 올바르게 식별해야 한다', async () => {
      mockShardResult.matches.get.mockResolvedValueOnce(matchData);

      const result = await service.getMatchSummary('steam', 'match-abc123');

      expect(result.topKiller.attributes.stats.name).toBe('Alpha');
      expect(result.topKiller.attributes.stats.kills).toBe(8);
    });

    it('총 이동 거리를 계산해야 한다', async () => {
      mockShardResult.matches.get.mockResolvedValueOnce(matchData);

      const result = await service.getMatchSummary('steam', 'match-abc123');

      const expectedDistance = (2000 + 500) * 3; // 모든 참가자 동일 walk+ride
      expect(result.matchStats.totalDistance).toBe(expectedDistance);
    });
  });

  // ---- getTeamRankings ----
  describe('getTeamRankings', () => {
    it('순위 기준으로 팀을 정렬하여 반환해야 한다', async () => {
      const rA = createRoster('rA', ['p2'], { rank: 2, teamId: 2 });
      const rB = createRoster('rB', ['p1'], { rank: 1, teamId: 1 });
      const data = createMatchResponse([p1, p2], [rA, rB]);
      mockShardResult.matches.get.mockResolvedValueOnce(data);

      const result = await service.getTeamRankings('steam', 'match-abc123');

      expect(result[0].rank).toBe(1);
      expect(result[1].rank).toBe(2);
    });

    it('팀별 참가자 상세 정보를 포함해야 한다', async () => {
      mockShardResult.matches.get.mockResolvedValueOnce(matchData);

      const result = await service.getTeamRankings('steam', 'match-abc123');

      const team1 = result.find(t => t.teamId === 1);
      expect(team1?.participants).toHaveLength(1);
      expect(team1?.participants[0].name).toBe('Alpha');
      expect(team1?.participants[0].kills).toBe(8);
    });

    it('우승 팀을 올바르게 표시해야 한다', async () => {
      mockShardResult.matches.get.mockResolvedValueOnce(matchData);

      const result = await service.getTeamRankings('steam', 'match-abc123');

      expect(result[0].won).toBe(true);
      expect(result[1].won).toBe(false);
    });

    it('팀 통계를 계산해야 한다', async () => {
      mockShardResult.matches.get.mockResolvedValueOnce(matchData);

      const result = await service.getTeamRankings('steam', 'match-abc123');

      const team2 = result.find(t => t.teamId === 2);
      expect(team2?.teamStats.totalKills).toBe(5 + 2);
      expect(team2?.teamStats.totalDamage).toBe(600 + 400);
    });
  });

  // ---- getPlayerStats ----
  describe('getPlayerStats', () => {
    it('winPlace 기준으로 정렬된 플레이어 스탯을 반환해야 한다', async () => {
      mockShardResult.matches.get.mockResolvedValueOnce(matchData);

      const result = (await service.getPlayerStats('steam', 'match-abc123'))!;

      expect(result[0].winPlace).toBe(1);
      expect(result[1].winPlace).toBe(2);
      expect(result[2].winPlace).toBe(3);
    });

    it('모든 스탯 필드를 포함해야 한다', async () => {
      mockShardResult.matches.get.mockResolvedValueOnce(matchData);

      const result = (await service.getPlayerStats('steam', 'match-abc123'))!;

      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('kills');
      expect(result[0]).toHaveProperty('assists');
      expect(result[0]).toHaveProperty('damage');
      expect(result[0]).toHaveProperty('headshotKills');
      expect(result[0]).toHaveProperty('survivalTime');
      expect(result[0]).toHaveProperty('winPlace');
      expect(result[0]).toHaveProperty('distance');
      expect(result[0]).toHaveProperty('items');
      expect(result[0]).toHaveProperty('performance');
    });

    it('총 이동 거리를 올바르게 계산해야 한다', async () => {
      mockShardResult.matches.get.mockResolvedValueOnce(matchData);

      const result = (await service.getPlayerStats('steam', 'match-abc123'))!;

      const player = result.find(p => p.name === 'Alpha');
      expect(player?.distance.total).toBe(2000 + 500 + 100);
    });
  });

  // ---- getKillLeaderboard ----
  describe('getKillLeaderboard', () => {
    it('킬 수 내림차순으로 정렬해야 한다', async () => {
      mockShardResult.matches.get.mockResolvedValueOnce(matchData);

      const result = (await service.getKillLeaderboard('steam', 'match-abc123'))!;

      expect(result[0].kills).toBe(8);
      expect(result[1].kills).toBe(5);
      expect(result[2].kills).toBe(2);
    });

    it('킬이 동점일 때 데미지를 기준으로 정렬해야 한다', async () => {
      const pa = createParticipant('pa', { name: 'Tie1', kills: 5, damageDealt: 800 });
      const pb = createParticipant('pb', { name: 'Tie2', kills: 5, damageDealt: 600 });
      const data = createMatchResponse([pa, pb], []);
      mockShardResult.matches.get.mockResolvedValueOnce(data);

      const result = (await service.getKillLeaderboard('steam', 'match-abc123'))!;

      expect(result[0].name).toBe('Tie1');
      expect(result[1].name).toBe('Tie2');
    });

    it('필요한 필드를 모두 포함해야 한다', async () => {
      mockShardResult.matches.get.mockResolvedValueOnce(matchData);

      const result = (await service.getKillLeaderboard('steam', 'match-abc123'))!;

      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('kills');
      expect(result[0]).toHaveProperty('damage');
      expect(result[0]).toHaveProperty('headshotKills');
      expect(result[0]).toHaveProperty('longestKill');
      expect(result[0]).toHaveProperty('winPlace');
    });
  });

  // ---- getDamageLeaderboard ----
  describe('getDamageLeaderboard', () => {
    it('데미지 내림차순으로 정렬해야 한다', async () => {
      mockShardResult.matches.get.mockResolvedValueOnce(matchData);

      const result = (await service.getDamageLeaderboard('steam', 'match-abc123'))!;

      expect(result[0].damage).toBe(800);
      expect(result[1].damage).toBe(600);
      expect(result[2].damage).toBe(400);
    });

    it('올바른 필드를 반환해야 한다', async () => {
      mockShardResult.matches.get.mockResolvedValueOnce(matchData);

      const result = (await service.getDamageLeaderboard('steam', 'match-abc123'))!;

      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('damage');
      expect(result[0]).toHaveProperty('kills');
      expect(result[0]).toHaveProperty('headshotKills');
      expect(result[0]).toHaveProperty('winPlace');
    });
  });

  // ---- getSurvivalLeaderboard ----
  describe('getSurvivalLeaderboard', () => {
    it('생존 시간 내림차순으로 정렬해야 한다', async () => {
      mockShardResult.matches.get.mockResolvedValueOnce(matchData);

      const result = (await service.getSurvivalLeaderboard('steam', 'match-abc123'))!;

      expect(result[0].survivalTime).toBe(1500);
      expect(result[1].survivalTime).toBe(1200);
      expect(result[2].survivalTime).toBe(900);
    });

    it('올바른 필드를 반환해야 한다', async () => {
      mockShardResult.matches.get.mockResolvedValueOnce(matchData);

      const result = (await service.getSurvivalLeaderboard('steam', 'match-abc123'))!;

      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('survivalTime');
      expect(result[0]).toHaveProperty('winPlace');
      expect(result[0]).toHaveProperty('kills');
      expect(result[0]).toHaveProperty('damage');
    });
  });

  // ---- getPlayerMatchStats ----
  describe('getPlayerMatchStats', () => {
    it('존재하는 플레이어의 스탯을 반환해야 한다 (대소문자 무시)', async () => {
      mockShardResult.matches.get.mockResolvedValueOnce(matchData);

      const result = await service.getPlayerMatchStats('steam', 'match-abc123', 'alpha');

      expect(result).not.toBeNull();
      expect(result?.name).toBe('Alpha');
      expect(result?.performance.kills).toBe(8);
    });

    it('플레이어를 찾을 수 없을 때 null을 반환해야 한다', async () => {
      mockShardResult.matches.get.mockResolvedValueOnce(matchData);

      const result = await service.getPlayerMatchStats('steam', 'match-abc123', 'NonExistent');

      expect(result).toBeNull();
    });

    it('플레이어의 로스터를 찾을 수 없을 때 null을 반환해야 한다', async () => {
      // 참가자는 존재하지만 로스터에 포함되지 않은 경우
      const loneP = createParticipant('lone', { name: 'Lone' });
      const data = createMatchResponse([loneP], []); // 로스터 없음
      mockShardResult.matches.get.mockResolvedValueOnce(data);

      const result = await service.getPlayerMatchStats('steam', 'match-abc123', 'Lone');

      expect(result).toBeNull();
    });

    it('로스터의 팀 통계를 포함해야 한다', async () => {
      mockShardResult.matches.get.mockResolvedValueOnce(matchData);

      const result = await service.getPlayerMatchStats('steam', 'match-abc123', 'Alpha');

      expect(result?.team.rank).toBe(1);
      expect(result?.team.teamId).toBe(1);
    });

    it('이동 데이터를 포함해야 한다', async () => {
      mockShardResult.matches.get.mockResolvedValueOnce(matchData);

      const result = await service.getPlayerMatchStats('steam', 'match-abc123', 'Alpha');

      expect(result?.movement.walkDistance).toBe(2000);
      expect(result?.movement.rideDistance).toBe(500);
      expect(result?.movement.swimDistance).toBe(100);
      expect(result?.movement.totalDistance).toBe(2600);
    });

    it('매치 메타 정보를 포함해야 한다', async () => {
      mockShardResult.matches.get.mockResolvedValueOnce(matchData);

      const result = await service.getPlayerMatchStats('steam', 'match-abc123', 'Alpha');

      expect(result?.matchId).toBe('match-abc123');
      expect(result?.gameMode).toBe('squad-fpp');
      expect(result?.mapName).toBe('Erangel_Main');
    });
  });

  // ---- getTeamAnalysis ----
  describe('getTeamAnalysis', () => {
    it('순위 기준으로 팀을 정렬하여 반환해야 한다', async () => {
      mockShardResult.matches.get.mockResolvedValueOnce(matchData);

      const result = await service.getTeamAnalysis('steam', 'match-abc123');

      expect(result[0].rank).toBe(1);
      expect(result[1].rank).toBe(2);
    });

    it('팀별 최고 성과자를 포함해야 한다', async () => {
      mockShardResult.matches.get.mockResolvedValueOnce(matchData);

      const result = await service.getTeamAnalysis('steam', 'match-abc123');

      const team2 = result.find(t => t.teamId === 2);
      expect(team2?.topPerformers.topKiller.name).toBe('Beta'); // 5킬 vs Gamma 2킬
      expect(team2?.topPerformers.topDamage.name).toBe('Beta'); // 600 vs 400
      expect(team2?.topPerformers.topSurvivor.name).toBe('Beta'); // 1200 vs 900
    });

    it('팀 효율성을 계산해야 한다', async () => {
      mockShardResult.matches.get.mockResolvedValueOnce(matchData);

      const result = await service.getTeamAnalysis('steam', 'match-abc123');

      const team2 = result.find(t => t.teamId === 2);
      expect(team2?.teamEfficiency.killsPerPlayer).toBe((5 + 2) / 2);
      expect(team2?.teamEfficiency.damagePerPlayer).toBe((600 + 400) / 2);
    });
  });

  // ---- getPlayerPerformanceAnalysis ----
  describe('getPlayerPerformanceAnalysis', () => {
    it('플레이어가 살아있을 때 KDA를 계산해야 한다 (deathType=alive)', async () => {
      const aliveP = createParticipant('alive', { name: 'Alive', kills: 5, assists: 3, deathType: 'alive', winPlace: 1 });
      const data = createMatchResponse([aliveP], []);
      mockShardResult.matches.get.mockResolvedValueOnce(data);

      const result = await service.getPlayerPerformanceAnalysis('steam', 'match-abc123');

      expect(result[0].performance.deaths).toBe(0);
      expect(result[0].performance.kda).toBe(8); // (5+3), 사망 없음
    });

    it('플레이어가 사망했을 때 KDA를 계산해야 한다 (deaths=1)', async () => {
      const deadP = createParticipant('dead', { name: 'Dead', kills: 4, assists: 2, deathType: 'byplayer', winPlace: 5 });
      const data = createMatchResponse([deadP], []);
      mockShardResult.matches.get.mockResolvedValueOnce(data);

      const result = await service.getPlayerPerformanceAnalysis('steam', 'match-abc123');

      expect(result[0].performance.deaths).toBe(1);
      expect(result[0].performance.kda).toBe(6); // (4+2)/1
    });

    it('킬이 0일 때 damagePerKill로 0을 반환해야 한다', async () => {
      const noKillP = createParticipant('nk', { name: 'NoKill', kills: 0, damageDealt: 200, winPlace: 10 });
      const data = createMatchResponse([noKillP], []);
      mockShardResult.matches.get.mockResolvedValueOnce(data);

      const result = await service.getPlayerPerformanceAnalysis('steam', 'match-abc123');

      expect(result[0].performance.damagePerKill).toBe(0);
      expect(result[0].performance.headshotAccuracy).toBe(0);
    });

    it('헤드샷 정확도를 계산해야 한다', async () => {
      const hsP = createParticipant('hs', { name: 'Sniper', kills: 4, headshotKills: 2, winPlace: 2 });
      const data = createMatchResponse([hsP], []);
      mockShardResult.matches.get.mockResolvedValueOnce(data);

      const result = await service.getPlayerPerformanceAnalysis('steam', 'match-abc123');

      expect(result[0].performance.headshotAccuracy).toBe(0.5);
    });

    it('매치 시간 대비 생존 효율성을 계산해야 한다', async () => {
      const sp = createParticipant('sp', { name: 'Survivor', timeSurvived: 900, winPlace: 2 });
      const data = createMatchResponse([sp], []);
      mockShardResult.matches.get.mockResolvedValueOnce(data);

      const result = await service.getPlayerPerformanceAnalysis('steam', 'match-abc123');

      expect(result[0].efficiency.survivalEfficiency).toBe(0.5); // 900/1800
    });

    it('winPlace 오름차순으로 정렬해야 한다', async () => {
      mockShardResult.matches.get.mockResolvedValueOnce(matchData);

      const result = await service.getPlayerPerformanceAnalysis('steam', 'match-abc123');

      expect(result[0].winPlace).toBe(1);
      expect(result[1].winPlace).toBe(2);
    });
  });

  // ---- getMatchStatistics ----
  describe('getMatchStatistics', () => {
    it('전체 매치 통계를 반환해야 한다', async () => {
      mockShardResult.matches.get.mockResolvedValueOnce(matchData);

      const result = await service.getMatchStatistics('steam', 'match-abc123');

      expect(result.matchId).toBe('match-abc123');
      expect(result.playerCount).toBe(3);
      expect(result.teamCount).toBe(2);
      expect(result.summary.totalKills).toBe(15);
    });

    it('헤드샷 비율을 올바르게 계산해야 한다', async () => {
      // p1 헤드샷킬 1, 나머지 기본값 1씩 → 총 3 / 15킬
      mockShardResult.matches.get.mockResolvedValueOnce(matchData);

      const result = await service.getMatchStatistics('steam', 'match-abc123');

      expect(result.averages.headshotRate).toBe(Math.round((3 / 15) * 100) / 100);
    });

    it('총 킬이 0일 때 헤드샷 비율로 0을 반환해야 한다', async () => {
      const zeroKillP = createParticipant('z', { name: 'Zero', kills: 0, headshotKills: 0 });
      const data = createMatchResponse([zeroKillP], []);
      mockShardResult.matches.get.mockResolvedValueOnce(data);

      const result = await service.getMatchStatistics('steam', 'match-abc123');

      expect(result.averages.headshotRate).toBe(0);
    });

    it('생존 플레이어 수를 올바르게 계산해야 한다', async () => {
      mockShardResult.matches.get.mockResolvedValueOnce(matchData);

      const result = await service.getMatchStatistics('steam', 'match-abc123');

      // p1만 deathType='alive', p2·p3는 'byplayer'
      expect(result.summary.alivePlayers).toBe(1);
    });

    it('극단값을 계산해야 한다', async () => {
      mockShardResult.matches.get.mockResolvedValueOnce(matchData);

      const result = await service.getMatchStatistics('steam', 'match-abc123');

      expect(result.extremes.mostKills).toBe(8);
      expect(result.extremes.mostDamage).toBe(800);
    });
  });

  // ---- searchPlayers ----
  describe('searchPlayers', () => {
    it('검색어에 일치하는 플레이어를 반환해야 한다 (대소문자 무시)', async () => {
      mockShardResult.matches.get.mockResolvedValueOnce(matchData);

      const result = await service.searchPlayers('steam', 'match-abc123', 'alpha');

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Alpha');
    });

    it('부분 검색어로 여러 플레이어를 반환해야 한다', async () => {
      const pA = createParticipant('pA', { name: 'Player1' });
      const pB = createParticipant('pB', { name: 'Player2' });
      const pC = createParticipant('pC', { name: 'Someone' });
      const data = createMatchResponse([pA, pB, pC], []);
      mockShardResult.matches.get.mockResolvedValueOnce(data);

      const result = await service.searchPlayers('steam', 'match-abc123', 'Player');

      expect(result).toHaveLength(2);
      expect(result.map(p => p.name)).toContain('Player1');
      expect(result.map(p => p.name)).toContain('Player2');
    });

    it('일치하는 플레이어가 없을 때 빈 배열을 반환해야 한다', async () => {
      mockShardResult.matches.get.mockResolvedValueOnce(matchData);

      const result = await service.searchPlayers('steam', 'match-abc123', 'xyz999');

      expect(result).toHaveLength(0);
    });

    it('검색어가 모든 플레이어에 일치할 때 전체를 반환해야 한다', async () => {
      // Alpha, Beta, Gamma 모두 'a' 포함
      mockShardResult.matches.get.mockResolvedValueOnce(matchData);

      const result = await service.searchPlayers('steam', 'match-abc123', 'a');

      expect(result).toHaveLength(3);
    });

    it('각 플레이어에 대해 올바른 필드를 반환해야 한다', async () => {
      mockShardResult.matches.get.mockResolvedValueOnce(matchData);

      const result = await service.searchPlayers('steam', 'match-abc123', 'Alpha');

      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('playerId');
      expect(result[0]).toHaveProperty('kills');
      expect(result[0]).toHaveProperty('damage');
      expect(result[0]).toHaveProperty('winPlace');
      expect(result[0]).toHaveProperty('survivalTime');
    });
  });
});
