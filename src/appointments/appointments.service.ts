import { TransactionHost, Transactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { DurationsService } from 'src/durations/durations.service';
import { DbService } from '../db/db.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    private txHost: TransactionHost<TransactionalAdapterPrisma>,
    private dbService: DbService,
    private durationsService: DurationsService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto, tx?: PrismaClient) {
    try {
      const { duration: time, ...appointmentDto } = createAppointmentDto;
      const duration = await this.durationsService.create(
        createAppointmentDto.duration,
        tx,
      );
      const appointment = await this.txHost.tx.appointment.create({
        data: {
          ...appointmentDto,
          durationId: duration.id,
        },
        include: {
          event: true,
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

  @Transactional()
  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    try {
      const { duration: time, ...appointmentDto } = updateAppointmentDto;
      const duration = await this.durationsService.create(
        updateAppointmentDto.duration,
      );
      const appointment = await this.txHost.tx.appointment.update({
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
