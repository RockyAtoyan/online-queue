import { Body, Controller, Param, Patch } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CompaniesService } from './companies.service';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Patch(':id')
  update(@Param('id') id, @Body() dto: Prisma.CompanyUpdateInput) {
    return this.companiesService.update(id, dto);
  }
}
