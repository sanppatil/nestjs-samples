import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GpgModule } from './gpg/gpg.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load environment variables globally
    GpgModule,
  ],
})
export class AppModule {}
