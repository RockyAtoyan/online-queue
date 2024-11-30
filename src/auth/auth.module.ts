import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmailsService } from 'src/emails/emails.service';
import { WidgetsService } from 'src/widgets/widgets.service';
import { CompaniesService } from '../companies/companies.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    CompaniesService,
    WidgetsService,
    EmailsService,
  ],
})
export class AuthModule {}
