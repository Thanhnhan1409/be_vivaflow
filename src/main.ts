import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { contentParser } from 'fastify-multer/lib';

import fastifyStatic from '@fastify/static';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as path from 'path';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './helpers';
import multipart from '@fastify/multipart';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { rawBody: true },
  );
  
  // await app.register(multipart);
  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('VivaFlow API')
    .setDescription('VivaFlow API Documentation')
    .setVersion('1.0')
    .setContact('VivaFlow', 'http://localhost', 'phanthithanhnhan1409@gmail.com')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  app.register(fastifyStatic, {
    root: path.join(__dirname, '..', 'public'),
    prefix: `/public/`,
  });

  SwaggerModule.setup(
    `api/${configService.get('swagger.docsUrl')}`,
    app,
    document,
  );

  app.useGlobalFilters(new HttpExceptionFilter(configService));

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.register(contentParser);

  await app.listen(configService.get('app.port'), '0.0.0.0');
}
bootstrap();
