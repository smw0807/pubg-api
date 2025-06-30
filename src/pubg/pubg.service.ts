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
        this.logger.error('PubgService.req()', e.message);
        // players 조회 시 404 에러 발생 시 에러 문구 변경
        if (requestUrl.includes('players') && e.message.includes('404')) {
          throw new HttpException(
            '플레이어 정보를 찾을 수 없습니다.',
            HttpStatus.NOT_FOUND,
          );
        }
        if (requestUrl.includes('matches') && e.message.includes('404')) {
          throw new HttpException(
            '매치 정보를 찾을 수 없습니다.',
            HttpStatus.NOT_FOUND,
          );
        }
        if (e.message.includes('401')) {
          throw new HttpException(
            'API 키가 올바르지 않습니다. 관리자에게 문의하세요.',
            HttpStatus.UNAUTHORIZED,
          );
        }
        if (e.message.includes('415') || e.message.includes('400')) {
          throw new HttpException(
            '요청 형식이 올바르지 않습니다. 관리자에게 문의하세요.',
            HttpStatus.UNSUPPORTED_MEDIA_TYPE,
          );
        }
        if (e.message.includes('429')) {
          throw new HttpException(
            'API 요청 제한을 초과했습니다. 잠시 후 다시 시도해주세요.',
            HttpStatus.TOO_MANY_REQUESTS,
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
