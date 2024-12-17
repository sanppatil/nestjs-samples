import { Module } from '@nestjs/common';
import { CosmosService } from './cosmos.service';
import { CosmosResolver } from './cosmos.resolver';

@Module({
  providers: [CosmosService, CosmosResolver],
})
export class CosmosModule {}
