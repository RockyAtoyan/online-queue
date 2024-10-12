import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { DbService } from '../db/db.service';
import { TimesService } from '../times/times.service';
import { TransactionHost, Transactional } from '@nestjs-cls/transactional';

@Injectable()
export class SchedulesService {
  constructor(
    private txHost: TransactionHost<TransactionalAdapterPrisma>,
    private dbService: DbService,
    private timesService: TimesService,
  ) {}

  async create(createScheduleDto: CreateScheduleDto) {
    try {
      const { times, ...scheduleDto } = createScheduleDto;
      const schedule = await this.txHost.tx.schedule.create({
        data: scheduleDto,
      });
      for (const time of times) {
        await this.timesService.create({
          ...time,
          scheduleId: schedule['id'],
          eventId: schedule.eventId,
        });
      }
      return schedule;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Transactional()
  async update(id: string, updateScheduleDto: UpdateScheduleDto) {
    try {
      const { times, ...scheduleDto } = updateScheduleDto;
      const schedule = await this.txHost.tx.schedule.update({
        where: { id },
        data: scheduleDto,
        include: {
          times: true,
        },
      });
      for (const time of schedule.times) {
        await this.txHost.tx.time.delete({ where: { id: time.id } });
      }
      for (const time of times) {
        await this.timesService.create({
          ...time,
          scheduleId: schedule.id,
          eventId: schedule.eventId,
        });
      }
      return await this.txHost.tx.schedule.findUnique({
        where: { id: schedule.id },
      });
    } catch (e) {
      throw new BadRequestException(e.message);
    }
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
