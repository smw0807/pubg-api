import { Module } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';
import { TelemetryController } from './telemetry.controller';
import { PubgModule } from '@/pubg/pubg.module';
import { MatchesModule } from '@/matches/matches.module';
@Module({
  imports: [PubgModule, MatchesModule],
  controllers: [TelemetryController],
  providers: [TelemetryService],
  exports: [TelemetryService],
})
export class TelemetryModule {}
