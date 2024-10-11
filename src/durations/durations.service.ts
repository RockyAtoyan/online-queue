import { Injectable } from '@nestjs/common';
import { CreateDurationDto } from './dto/create-duration.dto';
import { UpdateDurationDto } from './dto/update-duration.dto';

@Injectable()
export class DurationsService {
  create(createDurationDto: CreateDurationDto) {
    return 'This action adds a new duration';
  }

  findAll() {
    return `This action returns all durations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} duration`;
  }

  update(id: number, updateDurationDto: UpdateDurationDto) {
    return `This action updates a #${id} duration`;
  }

  remove(id: number) {
    return `This action removes a #${id} duration`;
  }
}
