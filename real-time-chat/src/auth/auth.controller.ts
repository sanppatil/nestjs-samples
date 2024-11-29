import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Request() req) {
    return req.user; // Simulated response for testing
  }

  @UseGuards(AuthGuard('jwt')) // Protect this route with JWT AuthGuard
  @Post('protected')
  async protectedRoute(@Request() req) {
    return { message: 'You are authorized!', user: req.user };
  }
}
