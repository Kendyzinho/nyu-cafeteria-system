# Frontend - NYU Cafeteria System

Aplicación Angular para estudiantes y administradores de cafetería universitaria.

## Funcionalidades implementadas

- Login con JWT
- Gestión de sesión y cierre por expiración
- Perfil del usuario autenticado
- Guards de acceso (`AuthGuard`, `ResidentGuard`, `RoleGuard`, `GuestGuard`)
- Rutas protegidas para módulo admin
- Gestión de usuarios (vista admin)

## Requisitos

- Node.js 18+
- npm 9+

## Configuración

La app consume la API en `http://localhost:3000/api` (definido en servicios).

## Ejecución local

```bash
npm install
npm run start
```

Abre `http://localhost:4200`.

## Build

```bash
npm run build
```

## Testing

```bash
npm run test
npm run test:auth
```

## Estructura base

- `src/app/core`: servicios, guards, interceptores, modelos
- `src/app/features`: páginas y componentes por módulo
- `src/app/shared`: componentes reutilizables
