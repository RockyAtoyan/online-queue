import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CompaniesService } from '../companies/companies.service';
import { compareSync, hashSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { DbService } from '../db/db.service';
import * as process from 'process';

@Injectable()
export class AuthService {
  constructor(
    private companiesService: CompaniesService,
    private jwtService: JwtService,
  ) {}

  async signUp(email: string, name: string, password: string) {
    const candidate = await this.companiesService.findOne(email);
    if (candidate) throw new BadRequestException('Company already signed up!');
    const newCompany = await this.companiesService.create({
      email,
      name,
      password: hashSync(password, 10),
    });
    const { password: pass, ...result } = newCompany;
    return result;
  }

  async signIn(email: string, password: string) {
    const company = await this.companiesService.findOne(email);
    if (!company || !compareSync(password, company.password)) {
      throw new UnauthorizedException();
    }
    const { password: pass, ...result } = company;
    const accessToken = await this.jwtService.signAsync(result, {
      secret: process.env.JWT_SECRET,
      expiresIn: '90d',
    });
    return { accessToken, ...result };
  }

  async auth(accessToken?: string) {
    if (!accessToken) throw new UnauthorizedException();
    try {
      const data = this.jwtService.verify(accessToken, {
        secret: process.env.JWT_SECRET,
      });
      const company = await this.companiesService.findOne(data.email);
      if (!company) {
        throw new UnauthorizedException();
      }
      return company;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
