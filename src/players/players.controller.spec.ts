import { Test, TestingModule } from '@nestjs/testing';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';

const mockPlayer = {
  type: 'player',
  id: 'account.test123',
  attributes: { name: 'TestPlayer', shardId: 'kakao', banType: 'Innocent' },
  relationships: { assets: { data: [] }, matches: { data: [] } },
};

const mockPlayersService = {
  getPlayers: jest.fn(),
};

describe('PlayersController', () => {
  let controller: PlayersController;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayersController],
      providers: [{ provide: PlayersService, useValue: mockPlayersService }],
    }).compile();

    controller = module.get<PlayersController>(PlayersController);
  });

  it('정의되어 있어야 한다', () => {
    expect(controller).toBeDefined();
  });

  describe('getPlayers', () => {
    it('올바른 인자로 PlayersService.getPlayers를 호출해야 한다', async () => {
      mockPlayersService.getPlayers.mockResolvedValueOnce(mockPlayer);

      const result = await controller.getPlayers('kakao', 'TestPlayer');

      expect(mockPlayersService.getPlayers).toHaveBeenCalledWith('kakao', 'TestPlayer');
      expect(result).toEqual(mockPlayer);
    });

    it('steam 플랫폼에서도 동작해야 한다', async () => {
      mockPlayersService.getPlayers.mockResolvedValueOnce(mockPlayer);

      await controller.getPlayers('steam', 'SteamPlayer');

      expect(mockPlayersService.getPlayers).toHaveBeenCalledWith('steam', 'SteamPlayer');
    });

    it('서비스 에러를 전파해야 한다', async () => {
      mockPlayersService.getPlayers.mockRejectedValueOnce(new Error('Service Error'));

      await expect(controller.getPlayers('kakao', 'TestPlayer')).rejects.toThrow('Service Error');
    });
  });
});
