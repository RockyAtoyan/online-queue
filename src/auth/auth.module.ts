import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { CompaniesService } from '../companies/companies.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService, CompaniesService],
})
export class AuthModule {}
