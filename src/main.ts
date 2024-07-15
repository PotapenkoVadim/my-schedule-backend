import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  await app.listen(port);
}

bootstrap();
