import { Module } from '@nestjs/common';
import { GpgService } from './gpg.service';
import { GpgController } from './gpg.controller';

@Module({
  providers: [GpgService],
  controllers: [GpgController],
})
export class GpgModule {}
