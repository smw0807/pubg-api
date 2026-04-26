import { Test, TestingModule } from '@nestjs/testing';
import { SeasonsService } from './seasons.service';
import { PubgService } from 'pubg-kit/nestjs';
import type { Season } from 'pubg-kit';

const createSeason = (id: string, isCurrent: boolean, isOffseason = false): Season =>
  ({
    type: 'season',
    id,
    attributes: {
      isCurrentSeason: isCurrent,
      isOffseason,
    },
  } as unknown as Season);

const mockShardResult = {
  seasons: { getAll: jest.fn() },
};

const mockPubgService = {
  shard: jest.fn().mockReturnValue(mockShardResult),
};

describe('SeasonsService', () => {
  let service: SeasonsService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeasonsService,
        { provide: PubgService, useValue: mockPubgService },
      ],
    }).compile();

    service = module.get<SeasonsService>(SeasonsService);
  });

  it('정의되어 있어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('getSeasons', () => {
    it('모든 시즌을 반환해야 한다', async () => {
      const seasons = [
        createSeason('season.1', false),
        createSeason('season.2', false),
        createSeason('season.3', true),
      ];
      mockShardResult.seasons.getAll.mockResolvedValueOnce(seasons);

      const result = await service.getSeasons('kakao');

      expect(mockPubgService.shard).toHaveBeenCalledWith('kakao');
      expect(result).toHaveLength(3);
    });

    it('steam 플랫폼에서도 동작해야 한다', async () => {
      mockShardResult.seasons.getAll.mockResolvedValueOnce([]);

      await service.getSeasons('steam');

      expect(mockPubgService.shard).toHaveBeenCalledWith('steam');
    });

    it('시즌이 없을 때 빈 배열을 반환해야 한다', async () => {
      mockShardResult.seasons.getAll.mockResolvedValueOnce([]);

      const result = await service.getSeasons('kakao');

      expect(result).toHaveLength(0);
    });

    it('API 실패 시 에러를 던져야 한다', async () => {
      mockShardResult.seasons.getAll.mockRejectedValueOnce(new Error('API Error'));

      await expect(service.getSeasons('kakao')).rejects.toThrow('API Error');
    });
  });

  describe('getCurrentSeason', () => {
    it('현재 시즌을 반환해야 한다', async () => {
      const seasons = [
        createSeason('season.1', false),
        createSeason('season.2', true),
        createSeason('season.3', false),
      ];
      mockShardResult.seasons.getAll.mockResolvedValueOnce(seasons);

      const result = await service.getCurrentSeason('kakao');

      expect(result.id).toBe('season.2');
      expect(result.attributes.isCurrentSeason).toBe(true);
    });

    it('현재 시즌이 없을 때 undefined를 반환해야 한다', async () => {
      const seasons = [
        createSeason('season.1', false),
        createSeason('season.2', false),
      ];
      mockShardResult.seasons.getAll.mockResolvedValueOnce(seasons);

      const result = await service.getCurrentSeason('kakao');

      expect(result).toBeUndefined();
    });

    it('현재 시즌이 여러 개일 경우 첫 번째를 반환해야 한다', async () => {
      const seasons = [
        createSeason('season.1', true),
        createSeason('season.2', true),
      ];
      mockShardResult.seasons.getAll.mockResolvedValueOnce(seasons);

      const result = await service.getCurrentSeason('kakao');

      expect(result.id).toBe('season.1');
    });
  });
});
