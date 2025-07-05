import { Module } from '@nestjs/common';
import { LifetimeService } from './lifetime.service';
import { LifetimeController } from './lifetime.controller';
import { PubgModule } from '@/pubg/pubg.module';
@Module({
  imports: [PubgModule],
  controllers: [LifetimeController],
  providers: [LifetimeService],
})
export class LifetimeModule {}
