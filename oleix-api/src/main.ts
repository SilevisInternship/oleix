import { TOTAL_COUNT_HEADER } from './core/headers/total-count';

const dotenv = require('dotenv');
const config = dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
require('dotenv-expand').expand(config);

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.use(cookieParser());
  app.use((req, res, next) => {
    res.header('Access-Control-Expose-Headers', TOTAL_COUNT_HEADER);
    next();
  });
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser());
  app.enableCors();

  const options = new DocumentBuilder()
    .setTitle('OLEIX API')
    .setDescription('The OLEIX API description')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/swagger', app, document);

  const port = process.env.PORT || 3333;
  const host = process.env.HOST || 'localhost';

  await app.listen(port, () => {
    Logger.log(`Listening at http://${host}:${port}/${globalPrefix}`);
  });
}

bootstrap();
