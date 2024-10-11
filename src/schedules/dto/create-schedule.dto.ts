import { IsNotEmpty } from 'class-validator';
import { CreateTimeDto } from '../../times/dto/create-time.dto';

export class CreateScheduleDto {
  @IsNotEmpty()
  eventId: string;

  @IsNotEmpty()
  times: CreateTimeDto[];
}
