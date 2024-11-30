import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { EmailsService } from './emails.service';

@Controller('emails')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Post()
  create(@Body() createEmailDto: CreateEmailDto) {
    return this.emailsService.create(createEmailDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.emailsService.findOne(id);
  }

  @Get(':id/make-markup')
  getMakeMarkup(@Param('id') id: string) {
    return this.emailsService.getMakeMarkup(id);
  }

  @Get(':id/unmake-markup')
  getUnmakeMarkup(@Param('id') id: string) {
    return this.emailsService.getUnmakeMarkup(id);
  }

  @Get(':id/make')
  getMakeTemplate(@Param('id') id: string) {
    return this.emailsService.getMakeTemplate(id);
  }

  @Get(':id/unmake')
  getUnmakeTemplate(@Param('id') id: string) {
    return this.emailsService.getUnmakeTemplate(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmailDto: UpdateEmailDto) {
    return this.emailsService.update(id, updateEmailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.emailsService.remove(id);
  }
}
