import { Test, TestingModule } from '@nestjs/testing';
import { SeasonsController } from './seasons.controller';
import { SeasonsService } from './seasons.service';

const mockSeasonsService = {
  getSeasons: jest.fn(),
  getCurrentSeason: jest.fn(),
};

describe('SeasonsController', () => {
  let controller: SeasonsController;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeasonsController],
      providers: [{ provide: SeasonsService, useValue: mockSeasonsService }],
    }).compile();

    controller = module.get<SeasonsController>(SeasonsController);
  });

  it('정의되어 있어야 한다', () => {
    expect(controller).toBeDefined();
  });

  describe('getSeasons', () => {
    it('SeasonsService.getSeasons에 위임해야 한다', async () => {
      const seasons = [{ id: 'season.1' }, { id: 'season.2' }];
      mockSeasonsService.getSeasons.mockResolvedValueOnce(seasons);

      const result = await controller.getSeasons('kakao');

      expect(mockSeasonsService.getSeasons).toHaveBeenCalledWith('kakao');
      expect(result).toEqual(seasons);
    });

    it('steam 플랫폼에서도 동작해야 한다', async () => {
      mockSeasonsService.getSeasons.mockResolvedValueOnce([]);
      await controller.getSeasons('steam');
      expect(mockSeasonsService.getSeasons).toHaveBeenCalledWith('steam');
    });
  });

  describe('getCurrentSeason', () => {
    it('SeasonsService.getCurrentSeason에 위임해야 한다', async () => {
      const season = { id: 'season.2', attributes: { isCurrentSeason: true } };
      mockSeasonsService.getCurrentSeason.mockResolvedValueOnce(season);

      const result = await controller.getCurrentSeason('kakao');

      expect(mockSeasonsService.getCurrentSeason).toHaveBeenCalledWith('kakao');
      expect(result).toEqual(season);
    });
  });
});
