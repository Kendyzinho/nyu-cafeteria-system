# NYU Cafeteria System - Backend

Este es el proyecto backend para el sistema de gestión de la cafetería de NYU. Desarrollado con **NestJS (v11)**, expone una API RESTful robusta y segura para el manejo de usuarios, menú, inventario, pedidos y pagos.

---

## Tecnologías Principales

- **[NestJS](https://nestjs.com/) (v11)**: Framework progresivo de Node.js para construir aplicaciones backend eficientes, confiables y escalables.
- **[TypeScript](https://www.typescriptlang.org/)**: Lenguaje principal de desarrollo.
- **[TypeORM](https://typeorm.io/)**: ORM utilizado para interactuar con la base de datos relacional.
- **[MySQL](https://www.mysql.com/)**: Motor de base de datos relacional.
- **[Passport & JWT](http://www.passportjs.org/)**: Implementados para la autenticación y autorización segura basada en tokens.
- **[Swagger](https://swagger.io/)**: Para la documentación interactiva de la API y sus endpoints.

---

## Estructura del Proyecto

El código fuente está estructurado de manera modular y escalable, dividiendo responsabilidades claramente:

```text
src/
├── common/        # Decoradores personalizados, Guards (ej. JWT Auth), y Strategies de Passport.
├── controllers/   # Controladores que definen las rutas HTTP (endpoints) y manejan las peticiones.
│   ├── auth/      # Rutas de autenticación (login, registro).
│   ├── menu/      # Gestión del menú de la cafetería.
│   ├── pedidos/   # Creación y seguimiento de pedidos.
│   ├── pagos/     # Procesamiento de pagos.
│   └── ...        # (usuarios, stock, planes-comida, etc.)
├── database/      # Configuración de TypeORM y definición de Entidades (Entities).
└── providers/     # Servicios (Providers) que contienen la lógica de negocio para cada controlador.
```

---

## Requisitos Previos

Asegúrate de contar con lo siguiente en tu entorno local:

- [Node.js](https://nodejs.org/) (Versión 18 o superior)
- [npm](https://www.npmjs.com/) (Gestor de paquetes)
- [MySQL](https://www.mysql.com/) (Servidor de base de datos en ejecución)
- [Nest CLI](https://docs.nestjs.com/cli/overview) (Recomendado: `npm install -g @nestjs/cli`)

---

## Configuración del Entorno

1. Renombra o copia el archivo `.env.example` a `.env` en la raíz del backend (si aplica).
2. Configura las variables de entorno necesarias, como las credenciales de conexión a la base de datos MySQL y el secreto para JWT.

Ejemplo de variables comunes en el `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=nyu_cafeteria
JWT_SECRET=tu_secreto_seguro
```

---

## Instalación y Configuración Local

Navega al directorio del backend y ejecuta los siguientes comandos:

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar en modo desarrollo:**
   ```bash
   npm run start:dev
   ```
   > La API estará disponible en `http://localhost:3000` (o el puerto configurado).

---

## Scripts Disponibles

En el directorio del backend, cuentas con los siguientes comandos predefinidos:

- `npm run start`: Inicia la aplicación.
- `npm run start:dev`: Inicia la aplicación en modo desarrollo con recarga automática.
- `npm run start:prod`: Ejecuta el código compilado para producción.
- `npm run build`: Compila el proyecto en el directorio `dist/`.
- `npm run format`: Formatea el código fuente utilizando Prettier.
- `npm run lint`: Analiza el código buscando problemas de estilo o errores con ESLint.
- `npm test`: Ejecuta la suite de pruebas unitarias usando Jest.

---

## Documentación de la API (Swagger)

Una vez que el servidor esté en ejecución, puedes acceder a la interfaz interactiva de Swagger para explorar y probar todos los endpoints disponibles.

Típicamente disponible en:
```text
http://localhost:3000/api
```
*(Verifica en `src/main.ts` la ruta exacta configurada para la documentación).*

---

## Contribución

Sigue el estándar de arquitectura modular de NestJS. Crea componentes usando la CLI de Nest (`nest g resource nombre-recurso`). Asegúrate de ejecutar el linter y de que las pruebas pasen satisfactoriamente antes de proponer cambios a la rama principal.
