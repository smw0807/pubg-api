import { Test, TestingModule } from '@nestjs/testing';
import { PlayersService } from './players.service';
import { PubgService } from 'pubg-kit/nestjs';

const mockShardResult = {
  players: { getByNames: jest.fn() },
};

const mockPubgService = {
  shard: jest.fn().mockReturnValue(mockShardResult),
};

const mockPlayer = {
  type: 'player',
  id: 'account.test123',
  attributes: {
    name: 'TestPlayer',
    shardId: 'kakao',
    patchVersion: '1.0.0',
    banType: 'Innocent',
  },
  relationships: {
    assets: { data: [] },
    matches: { data: [{ id: 'match-1', type: 'match' }] },
  },
};

describe('PlayersService', () => {
  let service: PlayersService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayersService,
        { provide: PubgService, useValue: mockPubgService },
      ],
    }).compile();

    service = module.get<PlayersService>(PlayersService);
  });

  it('정의되어 있어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('getPlayers', () => {
    it('API 응답에서 첫 번째 플레이어를 반환해야 한다', async () => {
      mockShardResult.players.getByNames.mockResolvedValueOnce([mockPlayer]);

      const result = await service.getPlayers('kakao', 'TestPlayer');

      expect(mockPubgService.shard).toHaveBeenCalledWith('kakao');
      expect(mockShardResult.players.getByNames).toHaveBeenCalledWith(['TestPlayer']);
      expect(result).toEqual(mockPlayer);
    });

    it('steam 플랫폼으로 API를 호출해야 한다', async () => {
      mockShardResult.players.getByNames.mockResolvedValueOnce([mockPlayer]);

      await service.getPlayers('steam', 'SteamPlayer');

      expect(mockPubgService.shard).toHaveBeenCalledWith('steam');
      expect(mockShardResult.players.getByNames).toHaveBeenCalledWith(['SteamPlayer']);
    });

    it('플레이어 목록이 비어있을 때 undefined를 반환해야 한다', async () => {
      mockShardResult.players.getByNames.mockResolvedValueOnce([]);

      const result = await service.getPlayers('kakao', 'NonExistent');

      expect(result).toBeUndefined();
    });

    it('PubgService가 에러를 던질 때 에러를 전파해야 한다', async () => {
      mockShardResult.players.getByNames.mockRejectedValueOnce(new Error('API Error'));

      await expect(service.getPlayers('kakao', 'TestPlayer')).rejects.toThrow('API Error');
    });

    it('playerName을 단일 요소 배열로 전달해야 한다', async () => {
      mockShardResult.players.getByNames.mockResolvedValueOnce([mockPlayer]);

      await service.getPlayers('kakao', 'SinglePlayer');

      expect(mockShardResult.players.getByNames).toHaveBeenCalledWith(['SinglePlayer']);
    });
  });
});
