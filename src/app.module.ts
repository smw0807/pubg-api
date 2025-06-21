import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@config/config.module';
import { PlayersModule } from './players/players.module';
import { PubgModule } from './pubg/pubg.module';
import { SeasonsModule } from './seasons/seasons.module';

@Module({
  imports: [ConfigModule, PlayersModule, PubgModule, SeasonsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
