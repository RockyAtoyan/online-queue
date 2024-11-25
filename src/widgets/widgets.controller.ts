import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Render,
} from '@nestjs/common';
import { Public } from 'src/auth/decorators/auth-public.decorator';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';
import { WidgetsService } from './widgets.service';

@Controller('widgets')
export class WidgetsController {
  constructor(private readonly widgetsService: WidgetsService) {}

  @Public()
  @Get(':id')
  @Render('widget')
  findOne(@Param('id') id) {
    return this.widgetsService.findOne(id);
  }

  @Public()
  @Get(':id/appointments')
  getWidgetAppointments(@Param('id') id) {
    return this.widgetsService.getWidgetAppointments(id);
  }

  @Post()
  create(@Body() createWidgetDto: CreateWidgetDto) {
    return this.widgetsService.create(createWidgetDto);
  }

  @Patch(':id')
  update(@Param('id') id, updateWidgetDto: UpdateWidgetDto) {
    return this.widgetsService.update(id, updateWidgetDto);
  }

  @Delete(':id')
  remove(@Param('id') id) {
    return this.widgetsService.remove(id);
  }
}
