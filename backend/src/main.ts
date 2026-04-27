import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
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

  // todas las rutas quedan bajo el prefijo /api
  app.setGlobalPrefix('api');

  // configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('NYU Cafetería API')
    .setDescription('Documentación de los endpoints del sistema de cafetería')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // disponible en /docs

  // inicia el servidor en el puerto 3000
  await app.listen(3000);
}
bootstrap();