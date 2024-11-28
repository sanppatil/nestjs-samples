import { Module } from '@nestjs/common';
import { JwtModule } from './jwt/jwt.module';
import { ConfigurationModule } from './configuration/configuration.module';

@Module({
  imports: [JwtModule, ConfigurationModule], // Import both modules here
})
export class AppModule {}
