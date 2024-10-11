import { IsNotEmpty } from 'class-validator';
import { CreateDurationDto } from 'src/durations/dto/create-duration.dto';

export class CreateAppointmentDto {
  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  eventId: string;

  @IsNotEmpty()
  duration: CreateDurationDto;

  timeId?: string;
  weekDay?: number;
  customerId?: string;
}
