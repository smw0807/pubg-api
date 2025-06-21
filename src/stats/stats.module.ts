import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { PubgModule } from '@/pubg/pubg.module';
import { PlayersModule } from '@/players/players.module';
import { SeasonsModule } from '@/seasons/seasons.module';

@Module({
  imports: [PubgModule, PlayersModule, SeasonsModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
