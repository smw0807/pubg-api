import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsNotEmpty } from 'class-validator';
import { PlatformType } from '@/constants/platform';

export class GetPlayersDto {
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
  playerName: string;
}

// 응답 DTO
export class PlayerDataResponseDto {
  @ApiProperty({
    description: '플레이어 ID',
    example: 'account.1234567890abcdef',
  })
  id: string;

  @ApiProperty({
    description: '플레이어 타입',
    example: 'player',
  })
  type: string;

  @ApiProperty({
    description: '플레이어 속성',
    example: {
      name: 'PlayerName123',
      shardId: 'kakao',
      patchVersion: '1.0.0',
    },
  })
  attributes: {
    name: string;
    shardId: string;
    patchVersion: string;
  };

  @ApiProperty({
    description: '플레이어 관계 정보',
    example: {
      assets: { data: [] },
      matches: { data: [] },
    },
  })
  relationships: {
    assets: { data: any[] };
    matches: { data: any[] };
  };
}
