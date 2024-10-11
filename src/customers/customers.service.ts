import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { DbService } from '../db/db.service';

@Injectable()
export class CustomersService {
  constructor(private dbService: DbService) {}

  async create(createCustomerDto: CreateCustomerDto) {
    try {
      const customer = await this.dbService.customer.create({
        data: createCustomerDto,
      });
      return customer;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    try {
      const customer = await this.dbService.customer.update({
        where: { id },
        data: updateCustomerDto,
      });
      return customer;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async remove(id: string) {
    try {
      const customer = await this.dbService.customer.delete({
        where: { id },
      });
      return customer;
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }
}
