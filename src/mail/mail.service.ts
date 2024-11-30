import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Email, Prisma } from '@prisma/client';
import * as hbs from 'handlebars';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendCustomerAppointment(
    companyName: string,
    email: Email,
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
    const context = {
      name: customer.name,
      eventName,
      companyName,
      date: customer.appointment.date.toLocaleDateString(),
      from: customer.appointment.duration.from,
      to: customer.appointment.duration.to,
    };
    let html;
    if (email.makeCustomHtml) {
      const template = hbs.compile(email.makeCustomHtml);
      html = template(context);
    }
    await this.mailerService.sendMail({
      from: `"${companyName}" <${process.env.SMTP_USER}>`,
      to: customer.email,
      subject: `Вы записаны на ${customer.appointment.date.toLocaleDateString()} в ${customer.appointment.duration.from} на ${eventName} в ${companyName}!`,
      template: html ? undefined : './ticket',
      html: html || undefined,
      context,
    });
  }

  async sendCustomerDeleteAppointmentMail(
    companyName: string,
    email: Email,
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
    const context = {
      name: customer.name,
      date: customer.appointment.date.toLocaleDateString(),
      from: customer.appointment.duration.from,
      to: customer.appointment.duration.to,
    };
    let html;
    if (email.unmakeCustomHtml) {
      const template = hbs.compile(email.unmakeCustomHtml);
      html = template(context);
    }
    await this.mailerService.sendMail({
      from: `"${companyName}" <${process.env.SMTP_USER}>`,
      to: customer.email,
      subject: `Ваша запись ${customer.appointment.date.toLocaleDateString()} в ${companyName} отменена!`,
      template: html ? undefined : './cancel',
      html: html || undefined,
      context,
    });
  }
}
