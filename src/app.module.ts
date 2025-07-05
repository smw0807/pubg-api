import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@config/config.module';
import { PlayersModule } from './players/players.module';
import { PubgModule } from './pubg/pubg.module';
import { SeasonsModule } from './seasons/seasons.module';
import { StatsModule } from './stats/stats.module';
import { MatchesModule } from './matches/matches.module';
import { TelemetryModule } from './telemetry/telemetry.module';
import { LifetimeModule } from './lifetime/lifetime.module';

@Module({
  imports: [
    ConfigModule,
    PlayersModule,
    PubgModule,
    SeasonsModule,
    StatsModule,
    MatchesModule,
    TelemetryModule,
    LifetimeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
