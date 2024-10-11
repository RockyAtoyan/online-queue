import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { SchedulesService } from '../schedules/schedules.service';
import { TimesService } from '../times/times.service';
import { CustomersService } from '../customers/customers.service';
import { DurationsService } from 'src/durations/durations.service';
import { AppointmentsService } from 'src/appointments/appointments.service';

@Module({
  controllers: [EventsController],
  providers: [
    EventsService,
    SchedulesService,
    TimesService,
    CustomersService,
    DurationsService,
    AppointmentsService,
  ],
})
export class EventsModule {}
