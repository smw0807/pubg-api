import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsNotEmpty } from 'class-validator';
import { PlatformType } from '@/constants/platform';

export class GetStatsDto {
  @ApiProperty({
    description: '플랫폼 타입',
    enum: ['steam', 'kakao'],
    example: 'kakao',
  })
  @IsEnum(['steam', 'kakao'])
  @IsNotEmpty()
  platform: PlatformType;

  @ApiProperty({
    description: '플레이어 닉네임',
    example: 'PlayerName123',
  })
  @IsString()
  @IsNotEmpty()
  nickname: string;
}

// 응답 DTO들
export class RankStatsResponseDto {
  @ApiProperty({
    description: '플레이어 ID',
    example: 'account.1234567890abcdef',
  })
  id: string;

  @ApiProperty({
    description: '랭크 스탯 데이터',
    example: {
      type: 'rankedPlayerStats',
      attributes: {
        rankPoints: 1500,
        tier: 'Gold',
        subTier: 'I',
        rank: 1250,
        subRank: 0,
        roundsPlayed: 50,
        avgRank: 15.5,
        top10Ratio: 0.3,
        winRatio: 0.05,
        avgDamage: 250.5,
        kills: 150,
        winStreak: 2,
        gamesWithKills: 35,
        roundMostKills: 8,
        longestKill: 450.5,
        headshotKills: 75,
        headshotKillRatio: 0.5,
        damageDealt: 12500.5,
        timeSurvived: 72000,
        walkDistance: 150000,
        rideDistance: 50000,
        swimDistance: 1000,
        rankPointsTitle: 'Gold I',
        bestRankPoints: 1800,
      },
    },
  })
  data: {
    type: string;
    attributes: {
      rankPoints: number;
      tier: string;
      subTier: string;
      rank: number;
      subRank: number;
      roundsPlayed: number;
      avgRank: number;
      top10Ratio: number;
      winRatio: number;
      avgDamage: number;
      kills: number;
      winStreak: number;
      gamesWithKills: number;
      roundMostKills: number;
      longestKill: number;
      headshotKills: number;
      headshotKillRatio: number;
      damageDealt: number;
      timeSurvived: number;
      walkDistance: number;
      rideDistance: number;
      swimDistance: number;
      rankPointsTitle: string;
      bestRankPoints: number;
    };
  };
}

export class NormalStatsResponseDto {
  @ApiProperty({
    description: '플레이어 ID',
    example: 'account.1234567890abcdef',
  })
  id: string;

  @ApiProperty({
    description: '일반 스탯 데이터',
    example: {
      type: 'playerSeason',
      attributes: {
        gameModeStats: {
          'squad-fpp': {
            assists: 25,
            boosts: 150,
            dBNOs: 10,
            dailyKills: 5,
            dailyWins: 1,
            damageDealt: 5000.5,
            days: 30,
            headshotKills: 40,
            heals: 200,
            killPoints: 1500,
            kills: 80,
            longestKill: 350.5,
            longestTimeSurvived: 1800,
            losses: 45,
            maxKillStreaks: 5,
            mostSurvivalTime: 1800,
            rankPoints: 0,
            rankPointsTitle: '',
            revives: 15,
            rideDistance: 50000,
            roadKills: 2,
            roundMostKills: 8,
            roundsPlayed: 50,
            roundSurvived: 45,
            suicides: 1,
            swimDistance: 1000,
            teamKills: 0,
            timeSurvived: 72000,
            top10s: 15,
            vehicleDestroys: 5,
            walkDistance: 150000,
            weaponsAcquired: 300,
            weeklyKills: 20,
            weeklyWins: 3,
            winPoints: 300,
            wins: 5,
          },
        },
      },
    },
  })
  data: {
    type: string;
    attributes: {
      gameModeStats: Record<string, any>;
    };
  };
}
