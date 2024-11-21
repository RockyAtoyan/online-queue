import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { EventsModule } from './events/events.module';
import { SchedulesModule } from './schedules/schedules.module';
import { TimesModule } from './times/times.module';
import { CustomersModule } from './customers/customers.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { DurationsModule } from './durations/durations.module';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { ClsModule } from 'nestjs-cls';
import { DbService } from './db/db.service';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { MailModule } from './mail/mail.module';
import { WidgetsModule } from './widgets/widgets.module';

@Module({
  imports: [
    ClsModule.forRoot({
      plugins: [
        new ClsPluginTransactional({
          imports: [DbModule],
          adapter: new TransactionalAdapterPrisma({
            prismaInjectionToken: DbService,
          }),
        }),
      ],
    }),
    DbModule,
    AuthModule,
    CompaniesModule,
    EventsModule,
    SchedulesModule,
    TimesModule,
    CustomersModule,
    AppointmentsModule,
    DurationsModule,
    MailModule,
    WidgetsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
