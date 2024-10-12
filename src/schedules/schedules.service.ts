import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { DbService } from '../db/db.service';
import { TimesService } from '../times/times.service';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class SchedulesService {
  constructor(
    private dbService: DbService,
    private timesService: TimesService,
  ) {}

  async create(createScheduleDto: CreateScheduleDto, tx?: PrismaClient) {
    const dbClient = tx || this.dbService;
    try {
      const { times, ...scheduleDto } = createScheduleDto;
      const schedule = await dbClient.schedule.create({
        data: scheduleDto,
      });
      for (const time of times) {
        await this.timesService.create(
          {
            ...time,
            scheduleId: schedule['id'],
            eventId: schedule.eventId,
          },
          tx,
        );
      }
      return schedule;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto) {
    return this.dbService.$transaction(async (tx) => {
      try {
        const { times, ...scheduleDto } = updateScheduleDto;
        const schedule = await tx.schedule.update({
          where: { id },
          data: scheduleDto,
          include: {
            times: true,
          },
        });
        for (const time of schedule.times) {
          await tx.time.delete({ where: { id: time.id } });
        }
        for (const time of times) {
          await this.timesService.create(
            {
              ...time,
              scheduleId: schedule.id,
              eventId: schedule.eventId,
            },
            tx as PrismaClient,
          );
        }
        return await tx.schedule.findUnique({
          where: { id: schedule.id },
        });
      } catch (e) {
        throw new BadRequestException(e.message);
      }
    });
  }

  async remove(id: string) {
    try {
      const schedule = await this.dbService.schedule.delete({
        where: { id },
      });
      return schedule;
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }
}
