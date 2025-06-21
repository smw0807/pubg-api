import { Controller, Get } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayerDataItem } from '@/models/players';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  async getPlayers(): Promise<PlayerDataItem> {
    return this.playersService.getPlayers();
  }
}
