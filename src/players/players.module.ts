import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { PubgModule } from '@pubg/pubg.module';

@Module({
  controllers: [PlayersController],
  providers: [PlayersService],
  imports: [PubgModule],
  exports: [PlayersService],
})
export class PlayersModule {}
