import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CosmosModule } from './cosmos/cosmos.module';
import { CosmosConfig } from './cosmos/cosmos-config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      resolvers: { JSON: GraphQLJSON }, // Register JSON scalar
    }),
    CosmosModule,
  ],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    // Load configurations from .env
    CosmosConfig.loadConfigsFromEnv();
    CosmosConfig.loadConfigsFromFile('./cosmos-config.json');
  }
}
