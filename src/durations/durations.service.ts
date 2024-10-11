import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDurationDto } from './dto/create-duration.dto';
import { DbService } from '../db/db.service';

@Injectable()
export class DurationsService {
  constructor(private dbService: DbService) {}

  async create(createDurationDto: CreateDurationDto) {
    try {
      const candidate = await this.dbService.duration.findFirst({
        where: createDurationDto,
      });
      if (candidate) return candidate;
      return this.dbService.duration.create({
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
