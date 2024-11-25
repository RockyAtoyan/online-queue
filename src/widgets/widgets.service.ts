import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DbService } from './../db/db.service';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';

@Injectable()
export class WidgetsService {
  constructor(private dvService: DbService) {}

  async findOne(id: string) {
    try {
      const widget = await this.dvService.widget.findUnique({
        where: { id },
        include: {
          company: {
            include: {
              events: {
                include: {
                  appointments: true,
                  schedule: {
                    include: {
                      times: {
                        include: {
                          times: true,
                          appointments: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      return { name: widget.company.name, email: widget.company.email };
    } catch (error) {
      console.log(error);
      throw new NotFoundException({}, { cause: error });
    }
  }

  async getWidgetAppointments(id: string) {
    try {
      const widget = await this.dvService.widget.findUnique({
        where: { id },
        include: {
          company: {
            include: {
              events: {
                include: {
                  appointments: {
                    where: {
                      customer: null,
                    },
                    include: {
                      duration: true,
                      event: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const appointments = this.serializedAppointments(widget.company.events);
      return appointments;
    } catch (error) {
      console.log(error);
      throw new NotFoundException({}, { cause: error });
    }
  }

  async create(createWidgetDto: CreateWidgetDto) {
    try {
      const widget = await this.dvService.widget.create({
        data: createWidgetDto,
      });
      return widget;
    } catch (error) {
      console.log(error);
      throw new BadRequestException({}, { cause: error });
    }
  }

  async update(id: string, updateWidgetDto: UpdateWidgetDto) {
    try {
      const widget = await this.dvService.widget.update({
        where: { id },
        data: updateWidgetDto,
      });
      return widget;
    } catch (error) {
      console.log(error);
      throw new BadRequestException({}, { cause: error });
    }
  }

  async remove(id: string) {
    try {
      const widget = await this.dvService.widget.delete({
        where: { id },
      });
      return widget;
    } catch (error) {
      console.log(error);
      throw new NotFoundException({}, { cause: error });
    }
  }

  private serializedAppointments(
    events: Prisma.EventGetPayload<{
      include: { appointments: { include: { duration: true; event: true } } };
    }>[],
  ) {
    try {
      const appointments = events.reduce((acc, event) => {
        return [...acc, ...event.appointments];
      }, []);
      const serializedAppointments = appointments.map((appointment) => {
        const start = new Date(appointment.date);
        start.setHours(+appointment.duration.from.split(':')[0]);
        start.setMinutes(+appointment.duration.from.split(':')[1]);

        const end = new Date(appointment.date);
        end.setHours(+appointment.duration.to.split(':')[0]);
        end.setMinutes(+appointment.duration.to.split(':')[1]);

        const rrule =
          appointment.weekDay != undefined
            ? {
                freq: 'weekly',
                interval: 1,
                byweekday: appointment.weekDay,
                dtstart: start.toISOString(),
              }
            : undefined;

        const startTime = {
          hours: +appointment.duration.from.split(':')[0],
          minutes: +appointment.duration.from.split(':')[1],
        };

        const endTime = {
          hours: +appointment.duration.to.split(':')[0],
          minutes: +appointment.duration.to.split(':')[1],
        };

        const durationMinutes =
          endTime.hours * 60 +
          endTime.minutes -
          startTime.hours * 60 -
          startTime.minutes;

        return {
          id: appointment.id,
          title: appointment.event.name,
          start,
          end,
          duration: {
            minutes: durationMinutes,
          },
          rrule,
          event: appointment.event,
          customer: appointment.customer,
        } as any;
      });
      return serializedAppointments;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
