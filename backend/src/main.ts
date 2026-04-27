// --- INICIO DEL PARCHE PARA NODE 18 ---
import * as crypto from 'crypto';
if (!global.crypto) {
  (global as any).crypto = { randomUUID: crypto.randomUUID };
}
// --- FIN DEL PARCHE ---

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  app.setGlobalPrefix('api');
  app.enableCors();

  await app.listen(3000);
}
bootstrap();