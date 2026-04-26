import { Test, TestingModule } from '@nestjs/testing';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

const mockStatsService = {
  getRankStats: jest.fn(),
  getNormalStats: jest.fn(),
  getRecentMatchStats: jest.fn(),
};

describe('StatsController', () => {
  let controller: StatsController;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatsController],
      providers: [{ provide: StatsService, useValue: mockStatsService }],
    }).compile();

    controller = module.get<StatsController>(StatsController);
  });

  it('정의되어 있어야 한다', () => {
    expect(controller).toBeDefined();
  });

  describe('getRankStats', () => {
    it('StatsService.getRankStats에 위임해야 한다', async () => {
      const mockResult = { duo: {}, squad: {}, squadFpp: {}, banType: 'Innocent' };
      mockStatsService.getRankStats.mockResolvedValueOnce(mockResult);

      const result = await controller.getRankStats('kakao', 'TestPlayer');

      expect(mockStatsService.getRankStats).toHaveBeenCalledWith('kakao', 'TestPlayer');
      expect(result).toEqual(mockResult);
    });
  });

  describe('getNormalStats', () => {
    it('StatsService.getNormalStats에 위임해야 한다', async () => {
      const mockResult = { solo: {}, squad: {}, banType: 'Innocent' };
      mockStatsService.getNormalStats.mockResolvedValueOnce(mockResult);

      const result = await controller.getNormalStats('steam', 'SteamPlayer');

      expect(mockStatsService.getNormalStats).toHaveBeenCalledWith('steam', 'SteamPlayer');
      expect(result).toEqual(mockResult);
    });
  });

  describe('getRecentMatchStats', () => {
    it('StatsService.getRecentMatchStats에 위임해야 한다', async () => {
      const mockResult = [{ matchId: 'match-1' }, { matchId: 'match-2' }];
      mockStatsService.getRecentMatchStats.mockResolvedValueOnce(mockResult);

      const result = await controller.getRecentMatchStats('kakao', 'TestPlayer');

      expect(mockStatsService.getRecentMatchStats).toHaveBeenCalledWith('kakao', 'TestPlayer');
      expect(result).toEqual(mockResult);
    });
  });
});
