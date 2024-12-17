import { Test, TestingModule } from '@nestjs/testing';
import { CosmosResolver } from './cosmos.resolver';

describe('CosmosResolver', () => {
  let resolver: CosmosResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CosmosResolver],
    }).compile();

    resolver = module.get<CosmosResolver>(CosmosResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
