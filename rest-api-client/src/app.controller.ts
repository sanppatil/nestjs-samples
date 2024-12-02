import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('external-data')
  async fetchData() {
    return this.appService.getDataFromExternalApi();
  }

  @Post('external-data')
  async sendData() {
    return this.appService.postDataToExternalApi();
  }
}
