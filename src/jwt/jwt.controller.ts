import { Controller, Query, Get } from '@nestjs/common';
import { JwtService } from './jwt.service';

@Controller('jwt')
export class JwtController {
  constructor(private readonly jwtService: JwtService) {}

  @Get('generatehash')
  generateHash(@Query('data') data: string): string {
    return this.jwtService.generateHash(data);
  }

  @Get('generatejwt')
  generateJWT(@Query('data') data: string): string {
    return this.jwtService.generateJWT(data);
  }
}
