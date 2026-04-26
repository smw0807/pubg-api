import { Module } from "@nestjs/common";
import { MasteryService } from "./mastery.service";
import { MasteryController } from "./mastery.controller";
import { PubgModule } from "@/pubg/pubg.module";
import { PlayersModule } from "@/players/players.module";

@Module({
  imports: [PubgModule, PlayersModule],
  controllers: [MasteryController],
  providers: [MasteryService],
})
export class MasteryModule { }