import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DbService } from '../db/db.service';

@Injectable()
export class CompaniesService {
  constructor(private dbService: DbService) {}

  async findOne(email: string) {
    const company = this.dbService.company.findUnique({
      where: {
        email,
      },
      include: {
        widget: true,
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

  create(dto: Prisma.CompanyCreateInput) {
    return this.dbService.company.create({
      data: dto,
    });
  }
}
