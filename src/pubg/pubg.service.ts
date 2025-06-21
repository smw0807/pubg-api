import { PlatformType } from '@/constants/platform';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

type Method = 'GET' | 'POST';

@Injectable()
export class PubgService {
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get<string>('pubg.apiUrl') ?? '';
    this.apiKey = this.configService.get<string>('pubg.apiKey') ?? '';
  }

  async req<T>(
    method: Method,
    platform: PlatformType,
    requestUrl: string,
  ): Promise<T> {
    if (!this.apiKey || !this.apiUrl) {
      throw new Error('API key or base URL is not set');
    }

    try {
      const url = `${this.apiUrl}/${platform}/${requestUrl}`;
      console.log(url);
      const response = (await firstValueFrom(
        this.httpService.request<T>({
          url,
          method,
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
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          throw new Error('API URL is not valid');
        }
        throw new Error(`Request failed: ${error.message}`);
      }
      throw new Error('Request failed');
    }
  }
}
