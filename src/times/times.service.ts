import { AppointmentsService } from './../appointments/appointments.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTimeDto } from './dto/create-time.dto';
import { UpdateTimeDto } from './dto/update-time.dto';
import { DbService } from '../db/db.service';
import { DurationsService } from '../durations/durations.service';
import { Appointment, Duration } from '@prisma/client';

@Injectable()
export class TimesService {
  constructor(
    private dbService: DbService,
    private durationService: DurationsService,
    private appointmentsService: AppointmentsService,
  ) {}

  async create(createTimeDto: CreateTimeDto) {
    try {
      const { appointments: apps, times, ...timeDto } = createTimeDto;
      const durations: Duration[] = [];
      for (const duration of times) {
        durations.push(await this.durationService.create({ ...duration }));
      }
      const appointments: Appointment[] = [];
      for (const appointment of apps) {
        appointments.push(
          await this.appointmentsService.create({ ...appointment }),
        );
      }
      const time = await this.dbService.time.create({
        data: {
          ...timeDto,
          times: {
            connect: durations,
          },
          appointments: {
            connect: appointments,
          },
        },
      });
      return time;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async update(id: string, updateTimeDto: UpdateTimeDto) {
    try {
      const { appointments, times, ...timeDto } = updateTimeDto;
      const time = await this.dbService.time.update({
        where: { id },
        data: {
          weekDay: updateTimeDto.weekDay,
          scheduleId: updateTimeDto.scheduleId,
        },
      });
      return time;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async remove(id: string) {
    try {
      const time = await this.dbService.time.delete({
        where: { id },
      });
      return time;
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }
}
