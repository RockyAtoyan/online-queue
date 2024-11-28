import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendCustomerAppointment(
    companyName: string,
    eventName: string,
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
      from: `"${companyName}" <${process.env.SMTP_USER}>`,
      to: customer.email,
      subject: `Вы записаны на ${customer.appointment.date.toLocaleDateString()} в ${customer.appointment.duration.from} на ${eventName} в ${companyName}!`,
      template: './ticket',
      context: {
        name: customer.name,
        eventName,
        companyName,
        date: customer.appointment.date.toLocaleDateString(),
        from: customer.appointment.duration.from,
        to: customer.appointment.duration.to,
      },
    });
  }

  async sendCustomerDeleteAppointmentMail(
    companyName: string,
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
      from: `"${companyName}" <${process.env.SMTP_USER}>`,
      to: customer.email,
      subject: `Ваша запись ${customer.appointment.date.toLocaleDateString()} в ${companyName} отменена!`,
      template: './cancel',
      context: {
        name: customer.name,
        date: customer.appointment.date.toLocaleDateString(),
        from: customer.appointment.duration.from,
        to: customer.appointment.duration.to,
      },
    });
  }
}
