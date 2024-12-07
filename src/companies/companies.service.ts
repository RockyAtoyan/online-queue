import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { DbService } from '../db/db.service';
import { EmailsService } from './../emails/emails.service';
import { WidgetsService } from './../widgets/widgets.service';

@Injectable()
export class CompaniesService {
  constructor(
    private dbService: DbService,
    private widgetsService: WidgetsService,
    private emailsService: EmailsService,
  ) {}

  async findOne(email: string) {
    const company = this.dbService.company.findUnique({
      where: {
        email,
      },
      include: {
        widget: true,
        emailHtml: true,
        events: {
          include: {
            appointments: {
              include: { duration: true, event: true, customer: true },
            },
          },
        },
      },
    });
    return company;
  }

  async create(dto: Prisma.CompanyCreateInput) {
    try {
      const company = await this.dbService.company.create({
        data: dto,
      });
      await this.widgetsService.create({ companyId: company.id });
      await this.emailsService.create({ companyId: company.id });
      return company;
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async update(id: string, dto: Prisma.CompanyUpdateInput) {
    try {
      if (dto.password) {
        dto.password = hashSync(String(dto.password), 10);
      }
      const company = await this.dbService.company.update({
        where: { id },
        data: dto,
      });
      const { password, ...rest } = company;
      return rest;
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }
}
