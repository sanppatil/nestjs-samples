import { Test, TestingModule } from '@nestjs/testing';
import { CosmosController } from './cosmos.controller';

describe('CosmosController', () => {
  let controller: CosmosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CosmosController],
    }).compile();

    controller = module.get<CosmosController>(CosmosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
