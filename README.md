# NYU Cafeteria System

Bienvenido al repositorio principal del Sistema de Gestión de la Cafetería de NYU. Este proyecto es una solución integral (Full-Stack) diseñada para modernizar y administrar eficientemente las operaciones de la cafetería, brindando interfaces y servicios dedicados tanto para administradores como para estudiantes.

---

## Arquitectura General

El sistema está dividido en dos partes principales y componentes de apoyo, garantizando modularidad, fácil mantenimiento y escalabilidad.

### 1. Frontend (Cliente)
Desarrollado como una Single Page Application (SPA) para ofrecer una experiencia de usuario fluida y reactiva.
- **Framework**: Angular 18
- **Lenguaje**: TypeScript
- **Estilos y Componentes**: HTML5, CSS3, SweetAlert2.
- **Directorio**: `/frontend`
- 📄 [Leer la documentación del Frontend](./frontend/README.md)

### 2. Backend (Servidor/API)
Desarrollado para exponer una API RESTful robusta y segura, centralizando toda la lógica de negocio y el acceso a datos.
- **Framework**: NestJS v11
- **Lenguaje**: TypeScript
- **ORM & BD**: TypeORM, MySQL
- **Autenticación**: Passport, JWT
- **Directorio**: `/backend`
- 📄 [Leer la documentación del Backend](./backend/README.md)

### 3. Base de Datos
El proyecto requiere una base de datos relacional MySQL.
Se incluye un script SQL de inicialización que contiene la estructura completa de tablas (usuarios, pedidos, menú, pagos, inventario) y posibles datos de prueba.
- **Archivo**: `nyu_cafeteria.sql`

### 4. Colección Postman
Para facilitar las pruebas de la API REST del backend, el repositorio incluye colecciones de Postman.
- **Directorios**: `/postman` y `/.postman`

---

## Requisitos del Sistema

Para ejecutar el sistema en un entorno de desarrollo local, se requiere:

- [Node.js](https://nodejs.org/) (v18 o superior)
- [npm](https://www.npmjs.com/) (Administrador de paquetes de Node)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) (Servidor de Base de Datos)
- [Angular CLI](https://angular.io/cli) (Recomendado para el frontend)
- [Nest CLI](https://nestjs.com/) (Recomendado para el backend)

---

## Instrucciones de Instalación Rápida

A continuación, se describen los pasos generales para poner en marcha el proyecto completo:

### Paso 1: Configurar la Base de Datos
1. Asegúrate de tener MySQL Server corriendo localmente.
2. Crea una base de datos llamada `nyu_cafeteria`.
3. Importa el archivo `nyu_cafeteria.sql` proporcionado en la raíz del repositorio hacia tu nueva base de datos para crear todas las tablas necesarias.

### Paso 2: Inicializar el Backend
1. Abre una terminal y navega a la carpeta del backend:
   ```bash
   cd backend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno basándote en el archivo de ejemplo (revisa el [README del backend](./backend/README.md) para más detalles).
4. Inicia el servidor de desarrollo:
   ```bash
   npm run start:dev
   ```

### Paso 3: Inicializar el Frontend
1. Abre una nueva terminal y navega a la carpeta del frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia la aplicación en modo desarrollo:
   ```bash
   npm start
   ```
   *(La aplicación estará disponible típicamente en `http://localhost:4200`)*

---

## Pruebas de API

Puedes importar el directorio `/postman` directamente a tu aplicación de Postman local. Esto te proporcionará todos los endpoints pre-configurados para probar flujos de autenticación, creación de pedidos, gestión de inventario, entre otros, sin necesidad de usar la interfaz de usuario del frontend.

---

## Convenciones de Contribución

- **Ramas (Branches)**: Se recomienda crear ramas descriptivas a partir de la rama principal (ej. `feature/nueva-funcionalidad`, `fix/correccion-error`).
- **Commits**: Mantener mensajes de commit claros que expliquen el propósito del cambio.
- **Validación**: Asegúrate de que el código compila tanto en el cliente como en el servidor (`npm run build`) y que pase las pruebas predefinidas (`npm run lint`, `npm test`) antes de realizar un Merge Request / Pull Request.
