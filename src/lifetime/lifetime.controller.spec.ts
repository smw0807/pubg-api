import { Test, TestingModule } from '@nestjs/testing';
import { LifetimeController } from './lifetime.controller';
import { LifetimeService } from './lifetime.service';

describe('LifetimeController', () => {
  let controller: LifetimeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LifetimeController],
      providers: [LifetimeService],
    }).compile();

    controller = module.get<LifetimeController>(LifetimeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
