import { Module } from '@nestjs/common';
import { AzureServiceBusModule } from './azure-service-bus/azure-service-bus.module';

@Module({
  imports: [AzureServiceBusModule],
})
export class AppModule {}
