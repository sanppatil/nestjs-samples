import { Module } from '@nestjs/common';
import { StreamController } from './stream.controller';
import { ServiceBusService } from './service-bus.service';

@Module({
  controllers: [StreamController],
  providers: [ServiceBusService],
})
export class ServiceBusModule {}
