// --- INICIO DEL PARCHE PARA NODE 18 ---
// En algunos entornos con Node 18, ciertas librerías esperan que exista `global.crypto`
// (por ejemplo para generar UUIDs). Este parche asegura que `crypto.randomUUID` esté disponible.
import * as crypto from 'crypto';
if (!global.crypto) {
  (global as any).crypto = { randomUUID: crypto.randomUUID };
}
// --- FIN DEL PARCHE ---

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ValidationPipe global: valida DTOs con class-validator y permite conversión implícita de tipos
  app.useGlobalPipes(new ValidationPipe({
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // Prefijo global: todas las rutas quedan bajo /api (ej: /api/auth/login)
  app.setGlobalPrefix('api');

  app.enableCors();

  // ---------------------------------------------------------------------------
  // Swagger / OpenAPI
  // ---------------------------------------------------------------------------
  // NOTA: SwaggerModule.setup() recibe la ruta SIN el prefijo global, pero como
  // setGlobalPrefix('api') ya fue aplicado, la ruta final en el navegador será:
  //   UI:   GET http://localhost:3000/api/docs
  //   JSON: GET http://localhost:3000/api/docs-json
  // ---------------------------------------------------------------------------
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NYU Cafeteria System API')
    .setDescription('Documentación de endpoints del backend')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  // El primer argumento es la ruta absoluta (no relativa al prefijo global).
  // La UI queda en /api/docs y el JSON en /api/docs-json.
  SwaggerModule.setup('api/docs', app, swaggerDocument);

  await app.listen(3000);
}
bootstrap();