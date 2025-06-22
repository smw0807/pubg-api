import { Controller, Get, Query, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiOkResponse,
} from '@nestjs/swagger';
import { MatchesService } from './matches.service';
import { PlatformType } from '@/constants/platform';
import {
  MatchSummaryResponseDto,
  PlayerStatsResponseDto,
  TeamRankingResponseDto,
} from './dto/matches.dto';

@ApiTags('matches')
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  @ApiOperation({
    summary: '매치 정보 조회',
    description: '특정 매치의 전체 정보를 조회합니다.',
  })
  @ApiQuery({
    name: 'platform',
    description: '플랫폼 타입',
    enum: ['steam', 'kakao'],
    example: 'steam',
  })
  @ApiQuery({
    name: 'matchId',
    description: '매치 ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiOkResponse({
    description: '매치 정보 조회 성공',
    type: Object,
  })
  async getMatches(
    @Query('platform') platform: PlatformType,
    @Query('matchId') matchId: string,
  ) {
    return this.matchesService.getMatches(platform, matchId);
  }

  @Get('summary')
  @ApiOperation({
    summary: '매치 요약 정보 조회',
    description:
      '매치의 요약 정보(게임 모드, 맵, 지속시간, 플레이어 수 등)를 조회합니다.',
  })
  @ApiQuery({
    name: 'platform',
    description: '플랫폼 타입',
    enum: ['steam', 'kakao'],
    example: 'steam',
  })
  @ApiQuery({
    name: 'matchId',
    description: '매치 ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiOkResponse({
    description: '매치 요약 정보 조회 성공',
    type: MatchSummaryResponseDto,
  })
  async getMatchSummary(
    @Query('platform') platform: PlatformType,
    @Query('matchId') matchId: string,
  ) {
    return this.matchesService.getMatchSummary(platform, matchId);
  }

  @Get('teams')
  @ApiOperation({
    summary: '팀 순위 조회',
    description: '매치에서 팀들의 순위 정보를 조회합니다.',
  })
  @ApiQuery({
    name: 'platform',
    description: '플랫폼 타입',
    enum: ['steam', 'kakao'],
    example: 'steam',
  })
  @ApiQuery({
    name: 'matchId',
    description: '매치 ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiOkResponse({
    description: '팀 순위 조회 성공',
    type: [TeamRankingResponseDto],
  })
  async getTeamRankings(
    @Query('platform') platform: PlatformType,
    @Query('matchId') matchId: string,
  ) {
    return this.matchesService.getTeamRankings(platform, matchId);
  }

  @Get('players')
  @ApiOperation({
    summary: '플레이어 통계 조회',
    description: '매치에서 모든 플레이어의 통계 정보를 조회합니다.',
  })
  @ApiQuery({
    name: 'platform',
    description: '플랫폼 타입',
    enum: ['steam', 'kakao'],
    example: 'steam',
  })
  @ApiQuery({
    name: 'matchId',
    description: '매치 ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiOkResponse({
    description: '플레이어 통계 조회 성공',
    type: [PlayerStatsResponseDto],
  })
  async getPlayerStats(
    @Query('platform') platform: PlatformType,
    @Query('matchId') matchId: string,
  ) {
    return this.matchesService.getPlayerStats(platform, matchId);
  }

  @Get('leaderboard/kills')
  @ApiOperation({
    summary: '킬 리더보드 조회',
    description:
      '매치에서 킬 수 기준으로 정렬된 플레이어 리더보드를 조회합니다.',
  })
  @ApiQuery({
    name: 'platform',
    description: '플랫폼 타입',
    enum: ['steam', 'kakao'],
    example: 'steam',
  })
  @ApiQuery({
    name: 'matchId',
    description: '매치 ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiOkResponse({
    description: '킬 리더보드 조회 성공',
    type: [PlayerStatsResponseDto],
  })
  async getKillLeaderboard(
    @Query('platform') platform: PlatformType,
    @Query('matchId') matchId: string,
  ) {
    return this.matchesService.getKillLeaderboard(platform, matchId);
  }

  @Get('leaderboard/damage')
  @ApiOperation({
    summary: '데미지 리더보드 조회',
    description:
      '매치에서 데미지 기준으로 정렬된 플레이어 리더보드를 조회합니다.',
  })
  @ApiQuery({
    name: 'platform',
    description: '플랫폼 타입',
    enum: ['steam', 'kakao'],
    example: 'steam',
  })
  @ApiQuery({
    name: 'matchId',
    description: '매치 ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiOkResponse({
    description: '데미지 리더보드 조회 성공',
    type: [PlayerStatsResponseDto],
  })
  async getDamageLeaderboard(
    @Query('platform') platform: PlatformType,
    @Query('matchId') matchId: string,
  ) {
    return this.matchesService.getDamageLeaderboard(platform, matchId);
  }

  @Get('leaderboard/survival')
  @ApiOperation({
    summary: '생존 시간 리더보드 조회',
    description:
      '매치에서 생존 시간 기준으로 정렬된 플레이어 리더보드를 조회합니다.',
  })
  @ApiQuery({
    name: 'platform',
    description: '플랫폼 타입',
    enum: ['steam', 'kakao'],
    example: 'steam',
  })
  @ApiQuery({
    name: 'matchId',
    description: '매치 ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiOkResponse({
    description: '생존 시간 리더보드 조회 성공',
    type: [PlayerStatsResponseDto],
  })
  async getSurvivalLeaderboard(
    @Query('platform') platform: PlatformType,
    @Query('matchId') matchId: string,
  ) {
    return this.matchesService.getSurvivalLeaderboard(platform, matchId);
  }

  @Get('player/:playerName')
  @ApiOperation({
    summary: '특정 플레이어 매치 통계 조회',
    description: '매치에서 특정 플레이어의 상세 통계 정보를 조회합니다.',
  })
  @ApiQuery({
    name: 'platform',
    description: '플랫폼 타입',
    enum: ['steam', 'kakao'],
    example: 'steam',
  })
  @ApiQuery({
    name: 'matchId',
    description: '매치 ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiParam({
    name: 'playerName',
    description: '플레이어 이름',
    example: 'PlayerName123',
  })
  @ApiOkResponse({
    description: '플레이어 매치 통계 조회 성공',
    type: PlayerStatsResponseDto,
  })
  async getPlayerMatchStats(
    @Query('platform') platform: PlatformType,
    @Query('matchId') matchId: string,
    @Param('playerName') playerName: string,
  ) {
    return this.matchesService.getPlayerMatchStats(
      platform,
      matchId,
      playerName,
    );
  }

  @Get('analysis/teams')
  @ApiOperation({
    summary: '팀 분석 조회',
    description: '매치에서 팀들의 성과 분석 정보를 조회합니다.',
  })
  @ApiQuery({
    name: 'platform',
    description: '플랫폼 타입',
    enum: ['steam', 'kakao'],
    example: 'steam',
  })
  @ApiQuery({
    name: 'matchId',
    description: '매치 ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiOkResponse({
    description: '팀 분석 조회 성공',
    type: Object,
  })
  async getTeamAnalysis(
    @Query('platform') platform: PlatformType,
    @Query('matchId') matchId: string,
  ) {
    return this.matchesService.getTeamAnalysis(platform, matchId);
  }

  @Get('analysis/performance')
  @ApiOperation({
    summary: '플레이어 성과 분석 조회',
    description: '매치에서 플레이어들의 성과 분석 정보를 조회합니다.',
  })
  @ApiQuery({
    name: 'platform',
    description: '플랫폼 타입',
    enum: ['steam', 'kakao'],
    example: 'steam',
  })
  @ApiQuery({
    name: 'matchId',
    description: '매치 ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiOkResponse({
    description: '플레이어 성과 분석 조회 성공',
    type: Object,
  })
  async getPlayerPerformanceAnalysis(
    @Query('platform') platform: PlatformType,
    @Query('matchId') matchId: string,
  ) {
    return this.matchesService.getPlayerPerformanceAnalysis(platform, matchId);
  }

  @Get('statistics')
  @ApiOperation({
    summary: '매치 통계 조회',
    description: '매치의 전체 통계 정보를 조회합니다.',
  })
  @ApiQuery({
    name: 'platform',
    description: '플랫폼 타입',
    enum: ['steam', 'kakao'],
    example: 'steam',
  })
  @ApiQuery({
    name: 'matchId',
    description: '매치 ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiOkResponse({
    description: '매치 통계 조회 성공',
    type: Object,
  })
  async getMatchStatistics(
    @Query('platform') platform: PlatformType,
    @Query('matchId') matchId: string,
  ) {
    return this.matchesService.getMatchStatistics(platform, matchId);
  }

  @Get('search')
  @ApiOperation({
    summary: '플레이어 검색',
    description: '매치에서 특정 검색어로 플레이어를 검색합니다.',
  })
  @ApiQuery({
    name: 'platform',
    description: '플랫폼 타입',
    enum: ['steam', 'kakao'],
    example: 'steam',
  })
  @ApiQuery({
    name: 'matchId',
    description: '매치 ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiQuery({
    name: 'q',
    description: '검색어',
    example: 'Player',
  })
  @ApiOkResponse({
    description: '플레이어 검색 성공',
    type: [PlayerStatsResponseDto],
  })
  async searchPlayers(
    @Query('platform') platform: PlatformType,
    @Query('matchId') matchId: string,
    @Query('q') searchTerm: string,
  ) {
    return this.matchesService.searchPlayers(platform, matchId, searchTerm);
  }
}
