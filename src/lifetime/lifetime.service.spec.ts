import { Test, TestingModule } from '@nestjs/testing';
import { LifetimeService } from './lifetime.service';
import { PubgService } from 'pubg-kit/nestjs';

const mockShardResult = {
  stats: { getLifetimeStats: jest.fn() },
};

const mockPubgService = {
  shard: jest.fn().mockReturnValue(mockShardResult),
};

const mockLifetimeStats = {
  data: {
    type: 'playerSeason',
    attributes: {
      gameModeStats: {
        squad: { wins: 10, top10s: 50, roundsPlayed: 100 },
        'squad-fpp': { wins: 5, top10s: 30, roundsPlayed: 80 },
      },
    },
  },
};

describe('LifetimeService', () => {
  let service: LifetimeService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LifetimeService,
        { provide: PubgService, useValue: mockPubgService },
      ],
    }).compile();

    service = module.get<LifetimeService>(LifetimeService);
  });

  it('정의되어 있어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('getLifetimeStats', () => {
    it('플레이어의 평생 스탯을 반환해야 한다', async () => {
      mockShardResult.stats.getLifetimeStats.mockResolvedValueOnce(mockLifetimeStats);

      const result = await service.getLifetimeStats('kakao', 'account.player1');

      expect(mockPubgService.shard).toHaveBeenCalledWith('kakao');
      expect(mockShardResult.stats.getLifetimeStats).toHaveBeenCalledWith('account.player1');
      expect(result).toEqual(mockLifetimeStats);
    });

    it('steam 플랫폼에서도 동작해야 한다', async () => {
      mockShardResult.stats.getLifetimeStats.mockResolvedValueOnce(mockLifetimeStats);

      await service.getLifetimeStats('steam', 'account.steam123');

      expect(mockPubgService.shard).toHaveBeenCalledWith('steam');
      expect(mockShardResult.stats.getLifetimeStats).toHaveBeenCalledWith('account.steam123');
    });

    it('API 실패 시 에러를 던져야 한다', async () => {
      mockShardResult.stats.getLifetimeStats.mockRejectedValueOnce(new Error('Not Found'));

      await expect(service.getLifetimeStats('kakao', 'invalid.id')).rejects.toThrow('Not Found');
    });
  });
});
