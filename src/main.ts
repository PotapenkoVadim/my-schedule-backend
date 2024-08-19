import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  const configService = app.get(ConfigService);
  const appTitle = configService.get('APP_NAME');
  const version = configService.get('APP_VERSION');
  const port = configService.get<number>('APP_PORT');

  const config = new DocumentBuilder()
    .setTitle(appTitle)
    .setVersion(version)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: [
      'http://localhost:3000',
      configService.get('CLIENT_HOST')
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  });

  await app.listen(port);
}

bootstrap();
