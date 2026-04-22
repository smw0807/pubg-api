import { Module } from '@nestjs/common';
import { PubgService } from './pubg.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@config/config.module';
import { PubgModule as PubgKitModule } from 'pubg-kit/nestjs'
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule, PubgKitModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      apiKey: configService.get<string>('pubg.apiKey') ?? '',
    }),
    inject: [ConfigService],
  })],
  providers: [PubgService],
  exports: [PubgService],
})
export class PubgModule { }
