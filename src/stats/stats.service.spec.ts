import { Test, TestingModule } from '@nestjs/testing';
import { StatsService } from './stats.service';
import { PubgService } from 'pubg-kit/nestjs';
import { PlayersService } from '@/players/players.service';
import { SeasonsService } from '@/seasons/seasons.service';
import { MatchesService } from '@/matches/matches.service';

const mockShardResult = {
  stats: {
    getPlayerRankedStats: jest.fn(),
    getPlayerStats: jest.fn(),
  },
};

const mockPubgService = {
  shard: jest.fn().mockReturnValue(mockShardResult),
};

const mockPlayersService = {
  getPlayers: jest.fn(),
};

const mockSeasonsService = {
  getCurrentSeason: jest.fn(),
};

const mockMatchesService = {
  getPlayerMatchStats: jest.fn(),
};

const mockPlayer = {
  id: 'account.player1',
  attributes: { banType: 'Innocent' },
  relationships: {
    matches: { data: [{ id: 'match-1' }, { id: 'match-2' }] },
  },
};

const mockSeason = {
  id: 'division.bro.official.pc-2018-01',
  attributes: { isCurrentSeason: true },
};

const mockRankedStatsResponse = {
  data: {
    attributes: {
      rankedGameModeStats: {
        duo: { roundsPlayed: 10, wins: 2 },
        squad: { roundsPlayed: 20, wins: 5 },
        'squad-fpp': { roundsPlayed: 30, wins: 8 },
      },
    },
  },
};

const mockNormalStatsResponse = {
  data: {
    attributes: {
      gameModeStats: {
        duo: { roundsPlayed: 5 },
        'duo-fpp': { roundsPlayed: 3 },
        solo: { roundsPlayed: 10 },
        'solo-fpp': { roundsPlayed: 8 },
        squad: { roundsPlayed: 20 },
        'squad-fpp': { roundsPlayed: 25 },
      },
    },
  },
};

describe('StatsService', () => {
  let service: StatsService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatsService,
        { provide: PubgService, useValue: mockPubgService },
        { provide: PlayersService, useValue: mockPlayersService },
        { provide: SeasonsService, useValue: mockSeasonsService },
        { provide: MatchesService, useValue: mockMatchesService },
      ],
    }).compile();

    service = module.get<StatsService>(StatsService);
  });

  it('정의되어 있어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('getRankStats', () => {
    beforeEach(() => {
      mockPlayersService.getPlayers.mockResolvedValue(mockPlayer);
      mockSeasonsService.getCurrentSeason.mockResolvedValue(mockSeason);
      mockShardResult.stats.getPlayerRankedStats.mockResolvedValue(mockRankedStatsResponse);
    });

    it('duo, squad, squadFpp 스탯과 banType을 반환해야 한다', async () => {
      const result = await service.getRankStats('kakao', 'TestPlayer');

      expect(result.duo).toEqual({ roundsPlayed: 10, wins: 2 });
      expect(result.squad).toEqual({ roundsPlayed: 20, wins: 5 });
      expect(result.squadFpp).toEqual({ roundsPlayed: 30, wins: 8 });
      expect(result.banType).toBe('Innocent');
    });

    it('올바른 플랫폼과 playerName으로 getPlayers를 호출해야 한다', async () => {
      await service.getRankStats('steam', 'SteamPlayer');

      expect(mockPlayersService.getPlayers).toHaveBeenCalledWith('steam', 'SteamPlayer');
    });

    it('올바른 플랫폼으로 getCurrentSeason을 호출해야 한다', async () => {
      await service.getRankStats('kakao', 'TestPlayer');

      expect(mockSeasonsService.getCurrentSeason).toHaveBeenCalledWith('kakao');
    });

    it('playerId와 seasonId로 getPlayerRankedStats를 호출해야 한다', async () => {
      await service.getRankStats('kakao', 'TestPlayer');

      expect(mockShardResult.stats.getPlayerRankedStats).toHaveBeenCalledWith(
        'account.player1',
        'division.bro.official.pc-2018-01',
      );
    });

    it('플레이어를 찾을 수 없을 때 에러를 전파해야 한다', async () => {
      mockPlayersService.getPlayers.mockRejectedValueOnce(new Error('Player not found'));

      await expect(service.getRankStats('kakao', 'Unknown')).rejects.toThrow('Player not found');
    });
  });

  describe('getNormalStats', () => {
    beforeEach(() => {
      mockPlayersService.getPlayers.mockResolvedValue(mockPlayer);
      mockSeasonsService.getCurrentSeason.mockResolvedValue(mockSeason);
      mockShardResult.stats.getPlayerStats.mockResolvedValue(mockNormalStatsResponse);
    });

    it('모든 게임 모드 스탯과 banType을 반환해야 한다', async () => {
      const result = await service.getNormalStats('kakao', 'TestPlayer');

      expect(result.duo).toEqual({ roundsPlayed: 5 });
      expect(result.duoFpp).toEqual({ roundsPlayed: 3 });
      expect(result.solo).toEqual({ roundsPlayed: 10 });
      expect(result.soloFpp).toEqual({ roundsPlayed: 8 });
      expect(result.squad).toEqual({ roundsPlayed: 20 });
      expect(result.squadFpp).toEqual({ roundsPlayed: 25 });
      expect(result.banType).toBe('Innocent');
    });

    it('올바른 인자로 getPlayerStats를 호출해야 한다', async () => {
      await service.getNormalStats('kakao', 'TestPlayer');

      expect(mockShardResult.stats.getPlayerStats).toHaveBeenCalledWith(
        'account.player1',
        'division.bro.official.pc-2018-01',
      );
    });
  });

  describe('getRecentMatchStats', () => {
    it('최근 매치의 스탯을 모두 반환해야 한다', async () => {
      mockPlayersService.getPlayers.mockResolvedValueOnce(mockPlayer);
      mockMatchesService.getPlayerMatchStats
        .mockResolvedValueOnce({ matchId: 'match-1', performance: { kills: 3 } })
        .mockResolvedValueOnce({ matchId: 'match-2', performance: { kills: 5 } });

      const result = await service.getRecentMatchStats('kakao', 'TestPlayer');

      expect(result).toHaveLength(2);
      expect(mockMatchesService.getPlayerMatchStats).toHaveBeenCalledTimes(2);
    });

    it('플레이어에게 매치가 없을 때 빈 배열을 반환해야 한다', async () => {
      const playerNoMatches = {
        ...mockPlayer,
        relationships: { matches: { data: [] } },
      };
      mockPlayersService.getPlayers.mockResolvedValueOnce(playerNoMatches);

      const result = await service.getRecentMatchStats('kakao', 'TestPlayer');

      expect(result).toHaveLength(0);
      expect(mockMatchesService.getPlayerMatchStats).not.toHaveBeenCalled();
    });

    it('relationships.matches가 없을 때 빈 배열을 반환해야 한다', async () => {
      const playerNoRelationships = {
        id: 'account.player1',
        attributes: { banType: 'Innocent' },
        relationships: {},
      };
      mockPlayersService.getPlayers.mockResolvedValueOnce(playerNoRelationships);

      const result = await service.getRecentMatchStats('kakao', 'TestPlayer');

      expect(result).toHaveLength(0);
    });

    it('각 매치마다 playerName과 함께 getPlayerMatchStats를 호출해야 한다', async () => {
      mockPlayersService.getPlayers.mockResolvedValueOnce(mockPlayer);
      mockMatchesService.getPlayerMatchStats.mockResolvedValue(null);

      await service.getRecentMatchStats('kakao', 'TestPlayer');

      expect(mockMatchesService.getPlayerMatchStats).toHaveBeenCalledWith('kakao', 'match-1', 'TestPlayer');
      expect(mockMatchesService.getPlayerMatchStats).toHaveBeenCalledWith('kakao', 'match-2', 'TestPlayer');
    });
  });
});
