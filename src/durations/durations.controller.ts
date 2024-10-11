import { Controller, Post, Body, Param, Delete } from '@nestjs/common';
import { DurationsService } from './durations.service';
import { CreateDurationDto } from './dto/create-duration.dto';
@Controller('durations')
export class DurationsController {
  constructor(private readonly durationsService: DurationsService) {}

  @Post()
  create(@Body() createDurationDto: CreateDurationDto) {
    return this.durationsService.create(createDurationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.durationsService.remove(id);
  }
}
