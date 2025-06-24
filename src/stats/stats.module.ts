import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { PubgModule } from '@/pubg/pubg.module';
import { PlayersModule } from '@/players/players.module';
import { SeasonsModule } from '@/seasons/seasons.module';
import { MatchesModule } from '@/matches/matches.module';

@Module({
  imports: [PubgModule, PlayersModule, SeasonsModule, MatchesModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
