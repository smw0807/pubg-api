import { Module } from '@nestjs/common';
import { PubgService } from './pubg.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@config/config.module';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [PubgService],
  exports: [PubgService],
})
export class PubgModule {}
