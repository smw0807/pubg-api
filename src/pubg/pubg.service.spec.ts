import { Test, TestingModule } from '@nestjs/testing';
import { PubgService } from './pubg.service';

describe('PubgService', () => {
  let service: PubgService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PubgService],
    }).compile();

    service = module.get<PubgService>(PubgService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
