import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  getHello(): string {
    const pubgApiUrl = this.configService.get<string>('pubg.apiUrl');
    const pubgApiKey = this.configService.get<string>('pubg.apiKey');
    console.log(pubgApiUrl, pubgApiKey);
    return `PUBG API URL: ${pubgApiUrl}`;
  }
}
