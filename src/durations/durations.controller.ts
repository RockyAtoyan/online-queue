import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DurationsService } from './durations.service';
import { CreateDurationDto } from './dto/create-duration.dto';
import { UpdateDurationDto } from './dto/update-duration.dto';

@Controller('durations')
export class DurationsController {
  constructor(private readonly durationsService: DurationsService) {}

  @Post()
  create(@Body() createDurationDto: CreateDurationDto) {
    return this.durationsService.create(createDurationDto);
  }

  @Get()
  findAll() {
    return this.durationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.durationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDurationDto: UpdateDurationDto) {
    return this.durationsService.update(+id, updateDurationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.durationsService.remove(+id);
  }
}
