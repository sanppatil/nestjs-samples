import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [HttpModule], // Import HttpModule here
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
