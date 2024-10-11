import { IsNotEmpty } from 'class-validator';
import { CreateScheduleDto } from '../../schedules/dto/create-schedule.dto';

export class CreateEventDto {
  @IsNotEmpty()
  name: string;

  schedule?: CreateScheduleDto;
}
