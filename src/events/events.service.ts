import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { DbService } from '../db/db.service';
import { SchedulesService } from '../schedules/schedules.service';

@Injectable()
export class EventsService {
  constructor(
    private dbService: DbService,
    private schedulesService: SchedulesService,
  ) {}

  async create(companyId: string, createEventDto: CreateEventDto) {
    try {
      const { schedule, ...eventDto } = createEventDto;
      const event = await this.dbService.event.create({
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

  async update(id: string, companyId: string, updateEventDto: UpdateEventDto) {
    try {
      const event = await this.dbService.event.update({
        where: { id },
        data: {
          name: updateEventDto.name,
          companyId: companyId,
        },
      });
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
