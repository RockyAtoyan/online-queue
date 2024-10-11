import { Module } from '@nestjs/common';
import { TimesService } from './times.service';
import { TimesController } from './times.controller';
import { CustomersService } from '../customers/customers.service';
import { DurationsService } from 'src/durations/durations.service';
import { AppointmentsService } from 'src/appointments/appointments.service';

@Module({
  controllers: [TimesController],
  providers: [
    TimesService,
    CustomersService,
    DurationsService,
    AppointmentsService,
  ],
})
export class TimesModule {}
