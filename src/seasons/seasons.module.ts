import { Module } from '@nestjs/common';
import { SeasonsService } from './seasons.service';
import { SeasonsController } from './seasons.controller';
import { PubgModule } from '@/pubg/pubg.module';

@Module({
  imports: [PubgModule],
  controllers: [SeasonsController],
  providers: [SeasonsService],
  exports: [SeasonsService],
})
export class SeasonsModule {}
