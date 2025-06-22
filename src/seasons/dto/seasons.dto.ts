import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { PlatformType } from '@/constants/platform';

export class GetSeasonsDto {
  @ApiProperty({
    description: '플랫폼 타입',
    enum: ['steam', 'kakao'],
    example: 'kakao',
  })
  @IsEnum(['steam', 'kakao'])
  @IsNotEmpty()
  platform: PlatformType;
}

// 응답 DTO
export class SeasonDataResponseDto {
  @ApiProperty({
    description: '시즌 ID',
    example: 'division.bro.official.pc-2018-01',
  })
  id: string;

  @ApiProperty({
    description: '시즌 타입',
    example: 'season',
  })
  type: string;

  @ApiProperty({
    description: '시즌 속성',
    example: {
      isCurrentSeason: true,
      isOffseason: false,
    },
  })
  attributes: {
    isCurrentSeason: boolean;
    isOffseason: boolean;
  };
}

export class SeasonsListResponseDto {
  @ApiProperty({
    description: '시즌 데이터 배열',
    type: [SeasonDataResponseDto],
  })
  data: SeasonDataResponseDto[];
}
