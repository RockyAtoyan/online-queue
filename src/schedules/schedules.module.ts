import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { TimesService } from '../times/times.service';
import { CustomersService } from '../customers/customers.service';
import { DurationsService } from 'src/durations/durations.service';
import { AppointmentsService } from 'src/appointments/appointments.service';

@Module({
  controllers: [SchedulesController],
  providers: [
    SchedulesService,
    TimesService,
    CustomersService,
    DurationsService,
    AppointmentsService,
  ],
})
export class SchedulesModule {}
