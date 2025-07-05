import { Test, TestingModule } from '@nestjs/testing';
import { LifetimeService } from './lifetime.service';

describe('LifetimeService', () => {
  let service: LifetimeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LifetimeService],
    }).compile();

    service = module.get<LifetimeService>(LifetimeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
