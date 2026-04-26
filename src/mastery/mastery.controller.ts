import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { MasteryService } from "./mastery.service";

@ApiTags('mastery')
@Controller('mastery')
export class MasteryController {
  constructor(private readonly masteryService: MasteryService) { }
}