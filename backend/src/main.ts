import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // crea la aplicación NestJS con el módulo principal
  const app = await NestFactory.create(AppModule);

  // permite peticiones desde otros orígenes (ej. Angular en localhost:4200)
  app.enableCors();

  // aplica validación a todos los endpoints de forma global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,        // elimina campos que no están definidos en el DTO
    transform: true,        // convierte los datos al tipo definido en el DTO
    transformOptions: {
      enableImplicitConversion: true, // convierte tipos automáticamente (ej. "1" → 1)
    },
  }));

  // todas las rutas quedan bajo el prefijo /api (ej. /api/menu, /api/users)
  app.setGlobalPrefix('api');

  // inicia el servidor en el puerto 3000
  await app.listen(3000);
}
bootstrap();