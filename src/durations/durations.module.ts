import { Module } from '@nestjs/common';
import { DurationsService } from './durations.service';
import { DurationsController } from './durations.controller';

@Module({
  controllers: [DurationsController],
  providers: [DurationsService],
})
export class DurationsModule {}
