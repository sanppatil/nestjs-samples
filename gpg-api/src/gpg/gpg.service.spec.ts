import { Test, TestingModule } from '@nestjs/testing';
import { GpgService } from './gpg.service';

describe('GpgService', () => {
  let service: GpgService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GpgService],
    }).compile();

    service = module.get<GpgService>(GpgService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
