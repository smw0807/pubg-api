import { PlatformType } from '@/constants/platform';
import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PubgService {
  private readonly logger = new Logger(PubgService.name);
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get<string>('pubg.apiUrl') ?? '';
    this.apiKey = this.configService.get<string>('pubg.apiKey') ?? '';
  }

  async GET<T>({
    platform,
    requestUrl,
  }: {
    platform?: PlatformType;
    requestUrl: string;
  }): Promise<T> {
    if (!this.apiKey || !this.apiUrl) {
      throw new Error('API key or base URL is not set');
    }

    try {
      const url = platform
        ? `${this.apiUrl}/${platform}/${requestUrl}`
        : `${this.apiUrl}/${requestUrl}`;
      this.logger.log(
        {
          method: 'GET',
          url,
        },
        'PubgService.req()',
      );
      const response = (await firstValueFrom(
        this.httpService.request<T>({
          url,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            accept: 'application/vnd.api+json',
          },
        }),
      )) as { data: T };

      if (!response) {
        throw new Error('No response received');
      }

      return response.data;
    } catch (e) {
      if (e instanceof Error) {
        // players 조회 시 404 에러 발생 시 에러 문구 변경
        if (requestUrl.includes('players') && e.message.includes('404')) {
          throw new HttpException(
            '플레이어 정보를 찾을 수 없습니다.',
            HttpStatus.NOT_FOUND,
          );
        }
      }
      throw new HttpException(
        'API 요청에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
