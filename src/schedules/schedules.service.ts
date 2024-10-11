import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { DbService } from '../db/db.service';
import { TimesService } from '../times/times.service';

@Injectable()
export class SchedulesService {
  constructor(
    private dbService: DbService,
    private timesService: TimesService,
  ) {}

  async create(createScheduleDto: CreateScheduleDto) {
    try {
      const { times, ...scheduleDto } = createScheduleDto;
      const schedule = await this.dbService.schedule.create({
        data: scheduleDto,
      });
      for (const time of times) {
        await this.timesService.create({ ...time, scheduleId: schedule['id'] });
      }
      return schedule;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto) {
    try {
      const { times, ...scheduleDto } = updateScheduleDto;
      const schedule = await this.dbService.schedule.update({
        where: { id },
        data: scheduleDto,
        include: {
          times: true,
        },
      });
      for (const time of schedule.times) {
        await this.timesService.remove(time.id);
      }
      for (const time of times) {
        await this.timesService.create({ ...time, scheduleId: schedule.id });
      }
      return await this.dbService.schedule.findUnique({
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
