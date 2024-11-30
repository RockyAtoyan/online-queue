import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as expressHbs from 'express-handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { DbService } from './../db/db.service';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';

@Injectable()
export class EmailsService {
  engine = expressHbs.create();

  constructor(private dbService: DbService) {}

  async create(createEmailDto: CreateEmailDto) {
    try {
      const email = await this.dbService.email.create({
        data: createEmailDto,
      });
      return email;
    } catch (error) {
      console.log(error);
      throw new BadRequestException({}, { cause: error });
    }
  }

  async findOne(id: string) {
    try {
      const email = await this.dbService.email.findUnique({
        where: { id },
        include: {
          company: {
            include: {
              events: {
                include: {
                  appointments: true,
                  schedule: {
                    include: {
                      times: {
                        include: {
                          times: true,
                          appointments: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
      return email;
    } catch (error) {
      console.log(error);
      throw new NotFoundException({}, { cause: error });
    }
  }

  async getMakeMarkup(id: string) {
    try {
      const email = await this.findOne(id);
      if (email.makeCustomHtml) {
        return email.makeCustomHtml;
      }
      const templatePath = path.join(
        __dirname,
        '..',
        'mail',
        'templates',
        'ticket.hbs',
      );
      const templateContent = fs.readFileSync(templatePath, 'utf-8');
      return templateContent;
    } catch (error) {
      console.log(error);
      throw new NotFoundException({}, { cause: error });
    }
  }

  async getUnmakeMarkup(id: string) {
    try {
      const email = await this.findOne(id);
      if (email.unmakeCustomHtml) {
        return email.unmakeCustomHtml;
      }
      const templatePath = path.join(
        __dirname,
        '..',
        'mail',
        'templates',
        'cancel.hbs',
      );
      const templateContent = fs.readFileSync(templatePath, 'utf-8');
      return templateContent;
    } catch (error) {
      console.log(error);
      throw new NotFoundException({}, { cause: error });
    }
  }

  async getMakeTemplate(id: string) {
    try {
      const email = await this.findOne(id);
      const renderData = {
        name: 'Иван',
        eventName: '"Констультация"',
        companyName: email.company.name,
        date: new Date().toLocaleDateString(),
        from: '11:00',
        to: '12:00',
      };

      if (email.makeCustomHtml) {
        const template = this.engine.handlebars.compile(
          email.makeCustomHtml,
          {},
        );
        const html = template(renderData);
        return html;
      }
      const html = await this.engine.render(
        'src/mail/templates/ticket.hbs',
        renderData,
      );
      return html;
    } catch (error) {
      console.log(error);
      throw new NotFoundException({}, { cause: error });
    }
  }

  async getUnmakeTemplate(id: string) {
    try {
      const email = await this.findOne(id);
      const renderData = {
        name: 'Иван',
        date: new Date().toLocaleDateString(),
        from: '11:00',
        to: '12:00',
      };
      if (email.unmakeCustomHtml) {
        const template = this.engine.handlebars.compile(
          email.unmakeCustomHtml,
          {},
        );
        const html = template(renderData);
        return html;
      }
      const html = await this.engine.render(
        'src/mail/templates/cancel.hbs',
        renderData,
      );
      return html;
    } catch (error) {
      console.log(error);
      throw new NotFoundException({}, { cause: error });
    }
  }

  async update(id: string, updateEmailDto: UpdateEmailDto) {
    try {
      const email = await this.dbService.email.update({
        where: { id },
        data: updateEmailDto,
      });
      return email;
    } catch (error) {
      console.log(error);
      throw new BadRequestException({}, { cause: error });
    }
  }

  async remove(id: string) {
    try {
      const email = await this.dbService.email.delete({
        where: { id },
      });
      return email;
    } catch (error) {
      console.log(error);
      throw new NotFoundException({}, { cause: error });
    }
  }
}
