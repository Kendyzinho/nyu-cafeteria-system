# Backend - NYU Cafeteria System

API REST en NestJS para gestión de cafetería universitaria.

## Funcionalidades implementadas

- Autenticación con JWT (`/api/auth/login`)
- Perfil autenticado (`/api/auth/profile`)
- Gestión de usuarios con control de roles (admin)
- Guards por autenticación y roles
- CRUD de menú, órdenes, planes, stock y promociones
- Documentación Swagger en `/docs`

## Tecnologías

- NestJS
- TypeORM
- MySQL
- class-validator / ValidationPipe
- Swagger

## Variables de entorno

Configura `.env` con:

- `DB_HOST`
- `DB_PORT`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`
- `JWT_EXPIRES_IN_SECONDS` (ej: `28800`)

## Ejecución local

```bash
npm install
npm run start:dev
```

API base: `http://localhost:3000/api`

## Build

```bash
npm run build
```

## Testing

```bash
npm run test
npm run test:auth
```
