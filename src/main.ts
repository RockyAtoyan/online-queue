import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as path from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: '*',
  });
  app.useStaticAssets(path.join(__dirname, '..', 'assets'));
  app.setBaseViewsDir(path.join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Online-queue')
    .setDescription('The online-queue API description')
    .setVersion('1.0')
    .addTag('queue')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  await app.listen(3000);
}
bootstrap();
