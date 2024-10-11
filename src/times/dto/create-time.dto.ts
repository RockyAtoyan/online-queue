import { IsNotEmpty } from 'class-validator';
import { CreateCustomerDto } from '../../customers/dto/create-customer.dto';
import { CreateDurationDto } from '../../durations/dto/create-duration.dto';
import { CreateAppointmentDto } from '../../appointments/dto/create-appointment.dto';

export class CreateTimeDto {
  @IsNotEmpty()
  scheduleId: string;

  @IsNotEmpty()
  weekDay: number;

  @IsNotEmpty()
  times: CreateDurationDto[];

  @IsNotEmpty()
  appointments: CreateAppointmentDto[];
}
