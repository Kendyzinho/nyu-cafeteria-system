import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { UserEntity } from './database/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

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
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT obtenido en /api/auth/login',
      },
      'jwt-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // disponible en /docs

  await seedDefaultAdmin(app);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;

  await app.listen(port);
}

async function seedDefaultAdmin(app: Awaited<ReturnType<typeof NestFactory.create>>) {
  const dataSource = app.get(DataSource);
  const userRepository = dataSource.getRepository(UserEntity);

  const existingAdmin = await userRepository
    .createQueryBuilder('user')
    .where('LOWER(user.email) = LOWER(:email)', { email: 'admin@nyu.edu' })
    .getOne();

  if (existingAdmin) return;

  const defaultPassword = await bcrypt.hash('Admin123!', 10);

  await userRepository.save(
    userRepository.create({
      nombre: 'Admin',
      apellido: 'NYU',
      email: 'admin@nyu.edu',
      password: defaultPassword,
      tipo: 'Administrador',
      isActive: true,
    }),
  );

  console.log('Default admin created: admin@nyu.edu / Admin123!');
}

bootstrap();
