import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDurationDto } from './dto/create-duration.dto';
import { DbService } from '../db/db.service';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DurationsService {
  constructor(private dbService: DbService) {}

  async create(createDurationDto: CreateDurationDto, tx?: PrismaClient) {
    const dbClient = tx || this.dbService;
    try {
      const candidate = await dbClient.duration.findFirst({
        where: createDurationDto,
      });
      if (candidate) return candidate;
      return dbClient.duration.create({
        data: createDurationDto,
      });
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async remove(id: string) {
    try {
      return this.dbService.duration.delete({
        where: { id },
      });
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }
}
