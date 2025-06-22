import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsNotEmpty } from 'class-validator';
import { PlatformType } from '@/constants/platform';

export class GetMatchesDto {
  @ApiProperty({
    description: '플랫폼 타입',
    enum: ['steam', 'kakao'],
    example: 'steam',
  })
  @IsEnum(['steam', 'kakao'])
  @IsNotEmpty()
  platform: PlatformType;

  @ApiProperty({
    description: '매치 ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsString()
  @IsNotEmpty()
  matchId: string;
}

export class GetPlayerMatchStatsDto extends GetMatchesDto {
  @ApiProperty({
    description: '플레이어 이름',
    example: 'PlayerName123',
  })
  @IsString()
  @IsNotEmpty()
  playerName: string;
}

export class SearchPlayersDto extends GetMatchesDto {
  @ApiProperty({
    description: '검색어',
    example: 'Player',
  })
  @IsString()
  @IsNotEmpty()
  q: string;
}

// 응답 DTO들
export class MatchSummaryResponseDto {
  @ApiProperty({
    description: '매치 ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  matchId: string;

  @ApiProperty({
    description: '게임 모드',
    example: 'squad-fpp',
  })
  gameMode: string;

  @ApiProperty({
    description: '맵 이름',
    example: 'Erangel',
  })
  mapName: string;

  @ApiProperty({
    description: '매치 지속 시간 (초)',
    example: 1800,
  })
  duration: number;

  @ApiProperty({
    description: '총 플레이어 수',
    example: 100,
  })
  totalPlayers: number;

  @ApiProperty({
    description: '총 팀 수',
    example: 25,
  })
  totalTeams: number;
}

export class PlayerStatsResponseDto {
  @ApiProperty({
    description: '플레이어 이름',
    example: 'PlayerName123',
  })
  name: string;

  @ApiProperty({
    description: '킬 수',
    example: 5,
  })
  kills: number;

  @ApiProperty({
    description: '데미지',
    example: 1250.5,
  })
  damageDealt: number;

  @ApiProperty({
    description: '생존 시간 (초)',
    example: 1200,
  })
  timeSurvived: number;

  @ApiProperty({
    description: '순위',
    example: 3,
  })
  rank: number;
}

export class TeamRankingResponseDto {
  @ApiProperty({
    description: '팀 ID',
    example: 1,
  })
  teamId: number;

  @ApiProperty({
    description: '팀 순위',
    example: 2,
  })
  rank: number;

  @ApiProperty({
    description: '팀 총 킬 수',
    example: 12,
  })
  totalKills: number;

  @ApiProperty({
    description: '팀 총 데미지',
    example: 3500.5,
  })
  totalDamage: number;
}
