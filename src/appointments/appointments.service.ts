import { DurationsService } from 'src/durations/durations.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { DbService } from '../db/db.service';

@Injectable()
export class AppointmentsService {
  constructor(
    private dbService: DbService,
    private durationsService: DurationsService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    try {
      const { duration: time, ...appointmentDto } = createAppointmentDto;
      const duration = await this.durationsService.create(
        createAppointmentDto.duration,
      );
      const appointment = await this.dbService.appointment.create({
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
    try {
      const { duration: time, ...appointmentDto } = updateAppointmentDto;
      const duration = await this.durationsService.create(
        updateAppointmentDto.duration,
      );
      const appointment = await this.dbService.appointment.update({
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
