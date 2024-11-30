import { Module } from '@nestjs/common';
import { EmailsService } from 'src/emails/emails.service';
import { WidgetsService } from 'src/widgets/widgets.service';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService, WidgetsService, EmailsService],
})
export class CompaniesModule {}
