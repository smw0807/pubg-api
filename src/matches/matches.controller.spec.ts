import { Test, TestingModule } from '@nestjs/testing';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';

const mockMatchesService = {
  getMatches: jest.fn(),
  getMatchSummary: jest.fn(),
  getTeamRankings: jest.fn(),
  getPlayerStats: jest.fn(),
  getKillLeaderboard: jest.fn(),
  getDamageLeaderboard: jest.fn(),
  getSurvivalLeaderboard: jest.fn(),
  getPlayerMatchStats: jest.fn(),
  getTeamAnalysis: jest.fn(),
  getPlayerPerformanceAnalysis: jest.fn(),
  getMatchStatistics: jest.fn(),
  searchPlayers: jest.fn(),
};

describe('MatchesController', () => {
  let controller: MatchesController;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchesController],
      providers: [{ provide: MatchesService, useValue: mockMatchesService }],
    }).compile();

    controller = module.get<MatchesController>(MatchesController);
  });

  it('정의되어 있어야 한다', () => {
    expect(controller).toBeDefined();
  });

  it('getMatches는 서비스에 위임해야 한다', async () => {
    mockMatchesService.getMatches.mockResolvedValueOnce({ data: { id: 'match-1' } });
    await controller.getMatches('steam', 'match-1');
    expect(mockMatchesService.getMatches).toHaveBeenCalledWith('steam', 'match-1');
  });

  it('getMatchSummary는 서비스에 위임해야 한다', async () => {
    mockMatchesService.getMatchSummary.mockResolvedValueOnce({ matchId: 'match-1' });
    await controller.getMatchSummary('steam', 'match-1');
    expect(mockMatchesService.getMatchSummary).toHaveBeenCalledWith('steam', 'match-1');
  });

  it('getTeamRankings는 서비스에 위임해야 한다', async () => {
    mockMatchesService.getTeamRankings.mockResolvedValueOnce([]);
    await controller.getTeamRankings('steam', 'match-1');
    expect(mockMatchesService.getTeamRankings).toHaveBeenCalledWith('steam', 'match-1');
  });

  it('getPlayerStats는 서비스에 위임해야 한다', async () => {
    mockMatchesService.getPlayerStats.mockResolvedValueOnce([]);
    await controller.getPlayerStats('steam', 'match-1');
    expect(mockMatchesService.getPlayerStats).toHaveBeenCalledWith('steam', 'match-1');
  });

  it('getKillLeaderboard는 서비스에 위임해야 한다', async () => {
    mockMatchesService.getKillLeaderboard.mockResolvedValueOnce([]);
    await controller.getKillLeaderboard('steam', 'match-1');
    expect(mockMatchesService.getKillLeaderboard).toHaveBeenCalledWith('steam', 'match-1');
  });

  it('getDamageLeaderboard는 서비스에 위임해야 한다', async () => {
    mockMatchesService.getDamageLeaderboard.mockResolvedValueOnce([]);
    await controller.getDamageLeaderboard('steam', 'match-1');
    expect(mockMatchesService.getDamageLeaderboard).toHaveBeenCalledWith('steam', 'match-1');
  });

  it('getSurvivalLeaderboard는 서비스에 위임해야 한다', async () => {
    mockMatchesService.getSurvivalLeaderboard.mockResolvedValueOnce([]);
    await controller.getSurvivalLeaderboard('steam', 'match-1');
    expect(mockMatchesService.getSurvivalLeaderboard).toHaveBeenCalledWith('steam', 'match-1');
  });

  it('getPlayerMatchStats는 playerName 파라미터와 함께 서비스에 위임해야 한다', async () => {
    mockMatchesService.getPlayerMatchStats.mockResolvedValueOnce({ name: 'Player' });
    await controller.getPlayerMatchStats('steam', 'match-1', 'PlayerName');
    expect(mockMatchesService.getPlayerMatchStats).toHaveBeenCalledWith('steam', 'match-1', 'PlayerName');
  });

  it('getTeamAnalysis는 서비스에 위임해야 한다', async () => {
    mockMatchesService.getTeamAnalysis.mockResolvedValueOnce([]);
    await controller.getTeamAnalysis('steam', 'match-1');
    expect(mockMatchesService.getTeamAnalysis).toHaveBeenCalledWith('steam', 'match-1');
  });

  it('getPlayerPerformanceAnalysis는 서비스에 위임해야 한다', async () => {
    mockMatchesService.getPlayerPerformanceAnalysis.mockResolvedValueOnce([]);
    await controller.getPlayerPerformanceAnalysis('steam', 'match-1');
    expect(mockMatchesService.getPlayerPerformanceAnalysis).toHaveBeenCalledWith('steam', 'match-1');
  });

  it('getMatchStatistics는 서비스에 위임해야 한다', async () => {
    mockMatchesService.getMatchStatistics.mockResolvedValueOnce({});
    await controller.getMatchStatistics('steam', 'match-1');
    expect(mockMatchesService.getMatchStatistics).toHaveBeenCalledWith('steam', 'match-1');
  });

  it('searchPlayers는 검색어와 함께 서비스에 위임해야 한다', async () => {
    mockMatchesService.searchPlayers.mockResolvedValueOnce([]);
    await controller.searchPlayers('steam', 'match-1', 'Player');
    expect(mockMatchesService.searchPlayers).toHaveBeenCalledWith('steam', 'match-1', 'Player');
  });
});
