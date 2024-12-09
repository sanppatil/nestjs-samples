import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CosmosModule } from './cosmos/cosmos.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), CosmosModule],
})
export class AppModule {}
