import { Module } from '@nestjs/common';
import { ServiceBusModule } from './service-bus/service-bus.module';

@Module({
  imports: [ServiceBusModule],
})
export class AppModule {}
