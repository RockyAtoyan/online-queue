import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { DurationsService } from 'src/durations/durations.service';

@Module({
  controllers: [AppointmentsController],
  providers: [AppointmentsService, DurationsService],
})
export class AppointmentsModule {}
