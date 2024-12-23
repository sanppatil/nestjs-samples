import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { ServiceBusService } from './service-bus.service';

@Controller('stream')
export class StreamController {
  constructor(private readonly serviceBusService: ServiceBusService) {}

  @Get()
  streamAllCities(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    this.serviceBusService.addGlobalClient(res);
  }

  @Get(':city')
  streamSpecificCity(@Param('city') city: string, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    this.serviceBusService.addCityClient(city, res);
  }
}
