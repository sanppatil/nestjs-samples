import { Resolver, Query, Args } from '@nestjs/graphql';
import { CosmosService } from './cosmos.service';
import GraphQLJSON from 'graphql-type-json';
import { CosmosConfig } from 'src/cosmos/cosmos-config';

@Resolver()
export class CosmosResolver {
  constructor(private readonly cosmosService: CosmosService) {}

  @Query(() => GraphQLJSON, { nullable: true })
  async getDocumentById(
    @Args('configName') configName: string,
    @Args('partitionKey') partitionKey: string,
    @Args('id') id: string,
  ) {
    return this.cosmosService.getDocumentById(configName, partitionKey, id);
  }

  @Query(() => GraphQLJSON, { nullable: true })
  async queryDocuments(
    @Args('configName') configName: string,
    @Args('partitionKey') partitionKey: string,
    @Args('id') id: string,
  ) {
    return this.cosmosService.queryDocuments(configName, partitionKey, id);
  }

  @Query(() => [String])
  getAllConfigNames() {
    return CosmosConfig.getAllConfigs().map(([name]) => name);
  }
}
