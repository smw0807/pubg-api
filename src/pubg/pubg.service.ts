import { PlatformType } from '@/constants/platform';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';

// 데이터 유형별 캐시 TTL (밀리초)
const CACHE_TTL = {
  MATCH: 24 * 60 * 60 * 1000,  // 24시간 - 매치 데이터는 불변
  SEASON: 60 * 60 * 1000,       // 1시간  - 시즌은 거의 변경 없음
  DEFAULT: 5 * 60 * 1000,       // 5분    - 플레이어/스탯 등
} as const;

function getTtl(requestUrl: string): number {
  if (/^matches\//.test(requestUrl)) return CACHE_TTL.MATCH;
  if (requestUrl.startsWith('seasons')) return CACHE_TTL.SEASON;
  return CACHE_TTL.DEFAULT;
}

@Injectable()
export class PubgService {
  private readonly logger = new Logger(PubgService.name);
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
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

    const cacheKey = platform ? `${platform}:${requestUrl}` : requestUrl;
    const cached = await this.cacheManager.get<T>(cacheKey);
    if (cached) {
      this.logger.debug(`Cache hit: ${cacheKey}`);
      return cached;
    }

    try {
      const url = platform
        ? `${this.apiUrl}/${platform}/${requestUrl}`
        : `${this.apiUrl}/${requestUrl}`;
      // this.logger.log(
      //   {
      //     method: 'GET',
      //     url,
      //   },
      //   'PubgService.req()',
      // );
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

      const ttl = getTtl(requestUrl);
      await this.cacheManager.set(cacheKey, response.data, ttl);

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

  async GETTelemetry<T>(url: string): Promise<T> {
    const cacheKey = `telemetry:${url}`;
    const cached = await this.cacheManager.get<T>(cacheKey);
    if (cached) {
      this.logger.debug(`Cache hit: ${cacheKey}`);
      return cached;
    }

    try {
      this.logger.log(
        {
          method: 'GET',
          url,
        },
        'PubgService.GETTelemetry()',
      );
      const response = await firstValueFrom(
        this.httpService.request<T>({
          url,
          method: 'GET',
          headers: {
            accept: 'application/vnd.api+json',
          },
        }),
      );

      await this.cacheManager.set(cacheKey, response.data, CACHE_TTL.MATCH);
      return response.data;
    } catch (e) {
      this.logger.error(e.status);
      this.logger.error(e.message);
      throw new HttpException(
        '텔레메트리 데이터를 가져오는데 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
