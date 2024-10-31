import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendCustomerAppointment(
    customer: Prisma.CustomerGetPayload<{
      include: {
        appointment: {
          include: {
            duration: true;
          };
        };
      };
    }>,
  ) {
    await this.mailerService.sendMail({
      to: customer.email,
      subject: 'Welcome to Online Queue!',
      template: './ticket',
      context: {
        name: customer.name,
        date: customer.appointment.date,
        from: customer.appointment.duration.from,
        to: customer.appointment.duration.to,
      },
    });
  }
}
