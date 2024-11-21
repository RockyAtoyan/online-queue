import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from './../db/db.service';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';

@Injectable()
export class WidgetsService {
  constructor(private dvService: DbService) {}

  async findOne(id: string) {
    try {
      const widget = await this.dvService.widget.findUnique({
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
      return { name: widget.company.name, email: widget.company.email };
    } catch (error) {
      console.log(error);
      throw new NotFoundException({}, { cause: error });
    }
  }

  async create(createWidgetDto: CreateWidgetDto) {
    try {
      const widget = await this.dvService.widget.create({
        data: createWidgetDto,
      });
      return widget;
    } catch (error) {
      console.log(error);
      throw new BadRequestException({}, { cause: error });
    }
  }

  async update(id: string, updateWidgetDto: UpdateWidgetDto) {
    try {
      const widget = await this.dvService.widget.update({
        where: { id },
        data: updateWidgetDto,
      });
      return widget;
    } catch (error) {
      console.log(error);
      throw new BadRequestException({}, { cause: error });
    }
  }

  async remove(id: string) {
    try {
      const widget = await this.dvService.widget.delete({
        where: { id },
      });
      return widget;
    } catch (error) {
      console.log(error);
      throw new NotFoundException({}, { cause: error });
    }
  }
}
