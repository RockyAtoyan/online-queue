import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CompaniesService {
  constructor(private dbService: DbService) {}

  async findOne(email: string) {
    const company = this.dbService.company.findUnique({
      where: {
        email,
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
