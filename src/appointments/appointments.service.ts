import { DurationsService } from 'src/durations/durations.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { DbService } from '../db/db.service';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  constructor(
    private dbService: DbService,
    private durationsService: DurationsService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto, tx?: PrismaClient) {
    const dbClient = tx || this.dbService;
    try {
      const { duration: time, ...appointmentDto } = createAppointmentDto;
      const duration = await this.durationsService.create(
        createAppointmentDto.duration,
        tx,
      );
      const appointment = await dbClient.appointment.create({
        data: {
          ...appointmentDto,
          durationId: duration.id,
        },
      });
      return appointment;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async findOne(id: string) {
    try {
      const appointment = await this.dbService.appointment.findUnique({
        where: { id },
      });
      return appointment;
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    return this.dbService.$transaction(async (tx) => {
      try {
        const { duration: time, ...appointmentDto } = updateAppointmentDto;
        const duration = await this.durationsService.create(
          updateAppointmentDto.duration,
          tx as PrismaClient,
        );
        const appointment = await tx.appointment.update({
          where: { id },
          data: {
            ...appointmentDto,
            durationId: duration.id,
          },
        });
        return appointment;
      } catch (e) {
        throw new BadRequestException(e.message);
      }
    });
  }

  async remove(id: string) {
    try {
      const appointment = await this.dbService.appointment.delete({
        where: { id },
      });
      return appointment;
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }
}
