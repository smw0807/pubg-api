import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  @ApiOperation({
    summary: 'API 상태 확인',
    description: 'PUBG API의 기본 정보와 상태를 확인합니다.',
  })
  @ApiOkResponse({
    description: 'API 상태 확인 성공',
    schema: {
      type: 'string',
      example: 'PUBG API URL: https://api.pubg.com',
    },
  })
  getHello(): string {
    const pubgApiUrl = this.configService.get<string>('pubg.apiUrl');
    return `PUBG API URL: ${pubgApiUrl}`;
  }

  @Get('health')
  @ApiOperation({
    summary: 'API 상태 확인',
    description: 'API의 상태를 확인합니다.',
  })
  @ApiOkResponse({
    description: 'API 상태 확인 성공',
    schema: {
      type: 'string',
      example: 'API is running',
    },
  })
  healthCheck(@Res() res: Response): Response {
    return res.status(200).json({ message: 'API is running' });
  }
}
