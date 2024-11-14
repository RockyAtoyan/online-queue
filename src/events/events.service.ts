import { TransactionHost, Transactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from '../db/db.service';
import { SchedulesService } from '../schedules/schedules.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    private txHost: TransactionHost<TransactionalAdapterPrisma>,
    private dbService: DbService,
    private schedulesService: SchedulesService,
  ) {}

  @Transactional()
  async create(companyId: string, createEventDto: CreateEventDto) {
    try {
      const { schedule, ...eventDto } = createEventDto;
      const event = await this.txHost.tx.event.create({
        data: { ...eventDto, companyId },
      });
      if (schedule) {
        const eventSchedule = await this.schedulesService.create({
          ...schedule,
          eventId: event['id'],
        });
      }
      return event;
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e.message);
    }
  }

  async findAll(companyId: string) {
    try {
      const events = await this.dbService.event.findMany({
        where: { companyId },
        include: {
          appointments: {
            include: {
              duration: true,
              customer: true,
              time: true,
              event: true,
            },
          },
          company: true,
          schedule: {
            include: {
              times: {
                select: {
                  appointments: {
                    include: {
                      duration: true,
                      customer: true,
                      time: true,
                      event: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      return events;
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }

  async findOne(id: string) {
    try {
      const event = await this.dbService.event.findUnique({
        where: { id },
        include: {
          appointments: {
            include: {
              duration: true,
              customer: true,
              time: true,
              event: true,
            },
          },
          company: true,
          schedule: {
            include: {
              times: {
                select: {
                  appointments: {
                    include: {
                      duration: true,
                      customer: true,
                      time: true,
                      event: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      return event;
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }

  @Transactional()
  async update(id: string, companyId: string, updateEventDto: UpdateEventDto) {
    try {
      const event = await this.txHost.tx.event.update({
        where: { id },
        data: {
          name: updateEventDto.name,
          companyId: companyId,
        },
        include: {
          schedule: true,
        },
      });
      if (updateEventDto.schedule) {
        await this.schedulesService.remove(event.schedule.id);
        const eventSchedule = await this.schedulesService.create({
          ...updateEventDto.schedule,
          eventId: event['id'],
        });
      }
      return event;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async remove(id: string) {
    try {
      const event = await this.dbService.event.delete({
        where: { id },
      });
      return event;
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }
}
