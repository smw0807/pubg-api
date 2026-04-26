import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@config/config.module';
import { PlayersModule } from './players/players.module';
import { PubgModule } from './pubg/pubg.module';
import { SeasonsModule } from './seasons/seasons.module';
import { StatsModule } from './stats/stats.module';
import { MatchesModule } from './matches/matches.module';
import { TelemetryModule } from './telemetry/telemetry.module';
import { LifetimeModule } from './lifetime/lifetime.module';
import { MasteryModule } from './mastery/mastery.module';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    ConfigModule,
    PlayersModule,
    PubgModule,
    SeasonsModule,
    StatsModule,
    MatchesModule,
    TelemetryModule,
    LifetimeModule,
    MasteryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
