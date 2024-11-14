import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Appointment, Duration, PrismaClient } from '@prisma/client';
import { DbService } from '../db/db.service';
import { DurationsService } from '../durations/durations.service';
import { AppointmentsService } from './../appointments/appointments.service';
import { CreateTimeDto } from './dto/create-time.dto';
import { UpdateTimeDto } from './dto/update-time.dto';

@Injectable()
export class TimesService {
  constructor(
    private txHost: TransactionHost<TransactionalAdapterPrisma>,
    private dbService: DbService,
    private durationService: DurationsService,
    private appointmentsService: AppointmentsService,
  ) {}

  async create(createTimeDto: CreateTimeDto, tx?: PrismaClient) {
    try {
      const { appointments: apps, times, eventId, ...timeDto } = createTimeDto;
      const durations: Duration[] = [];
      for (const duration of times) {
        durations.push(await this.durationService.create({ ...duration }, tx));
      }
      const appointments: Appointment[] = [];
      for (const appointment of apps) {
        appointments.push(
          await this.appointmentsService.create(
            { ...appointment, eventId, weekDay: timeDto.weekDay },
            tx,
          ),
        );
      }
      const time = await this.txHost.tx.time.create({
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
      const { appointments, times, eventId, ...timeDto } = updateTimeDto;
      const time = await this.dbService.time.update({
        where: { id },
        data: {
          weekDay: timeDto.weekDay,
          scheduleId: timeDto.scheduleId,
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
