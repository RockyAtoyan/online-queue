import { Transactional, TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from '../db/db.service';
import { MailService } from './../mail/mail.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    private txHost: TransactionHost<TransactionalAdapterPrisma>,
    private dbService: DbService,
    private mailService: MailService,
  ) {}

  @Transactional()
  async create(createCustomerDto: CreateCustomerDto) {
    try {
      const customer = await this.txHost.tx.customer.create({
        data: createCustomerDto,
        include: {
          appointment: {
            include: {
              event: {
                include: {
                  company: {
                    include: {
                      emailHtml: true,
                    },
                  },
                },
              },
              duration: true,
            },
          },
        },
      });
      await this.mailService.sendCustomerAppointment(
        customer.appointment.event.company.name,
        customer.appointment.event.company.emailHtml,
        customer.appointment.event.name,
        customer,
      );
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
