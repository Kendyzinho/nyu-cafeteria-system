# Sistema de Gestión de Cafetería NYU - API Backend

## Descripción General
Este repositorio contiene la infraestructura backend del Sistema de Gestión de Cafetería de NYU. Está construido como una API RESTful robusta y escalable utilizando el framework NestJS, diseñada para manejar solicitudes de alta concurrencia para la gestión de menús, procesamiento de pedidos y administración de planes alimentarios.

El sistema se integra con múltiples subsistemas universitarios (Alojamiento, Matrícula y Pasarelas de Pago Externas) para garantizar la consistencia de los datos y el cumplimiento de las reglas de negocio en todo el ecosistema del campus.

## Stack Técnico
*   **Framework:** NestJS (Node.js)
*   **Lenguaje:** TypeScript
*   **Base de Datos:** MySQL 8.0+
*   **ORM:** TypeORM
*   **Documentación:** OpenAPI (Swagger)
*   **Validación:** Class-validator y Class-transformer
*   **Seguridad:** Autenticación basada en JWT

## Arquitectura del Sistema
La aplicación sigue una arquitectura modular que promueve la separación de responsabilidades y una alta mantenibilidad:
*   **Controladores:** Manejan las solicitudes HTTP entrantes y las mapean a los métodos de servicio.
*   **Proveedores/Servicios:** Contienen la lógica de negocio central y las reglas de integración.
*   **Entidades:** Definen el esquema de la base de datos y las relaciones mediante decoradores de TypeORM.
*   **DTOs (Objetos de Transferencia de Datos):** Aplican una validación estricta de las entradas y seguridad de tipos.

## Módulos Principales
1.  **Módulo de Autenticación:** Gestiona el registro de usuarios, inicio de sesión y manejo seguro de sesiones.
2.  **Módulo de Planes Alimentarios:** Administra el catálogo de planes disponibles (Estándar, Flex, Residente) y gestiona las asignaciones de estudiantes.
3.  **Menú y Productos:** Gestiona el inventario de la cafetería, precios y disponibilidad.
4.  **Control de Stock:** Seguimiento en tiempo real de las cantidades de productos y agotamiento automático.
5.  **Promociones:** Gestión de campañas dinámicas con validación de requisitos cruzados entre servicios.

## Reglas de Integración (Contexto del Proyecto)
El backend implementa lógica de negocio específica para el ecosistema universitario:
*   **Integración con Matrícula (Eq. 3):** Valida el estado activo del estudiante para la elegibilidad de los planes Estándar y Flex.
*   **Integración con Alojamiento (Eq. 2):** Verifica el estado de residencia para la activación del Plan Residente y el procesamiento de pagos.
*   **Validación Financiera:** Aplica descuentos específicos y simulaciones de pasarela para transacciones con tarjetas de crédito externas.

## Instalación y Configuración

### Requisitos Previos
*   Node.js (v18.0 o superior)
*   Servidor MySQL
*   npm o yarn

### Configuración
1.  Navegar al directorio del backend: `cd backend`
2.  Instalar dependencias:
    ```bash
    npm install
    ```
3.  Configurar las variables de entorno en el archivo `.env`:
    ```env
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=root
    DB_PASS=tu_password
    DB_NAME=nyu_cafeteria
    ```

### Inicialización de la Base de Datos
El sistema utiliza la sincronización de TypeORM. Asegúrese de que la base de datos especificada en el `.env` exista; las tablas se generarán automáticamente en la primera ejecución.

## Ejecución

### Modo de Desarrollo
```bash
npm run start:dev
```

### Compilación para Producción
```bash
npm run build
npm run start:prod
```

## Documentación de la API
Una vez que el servidor esté en funcionamiento, puede acceder a la documentación interactiva (Swagger UI) en:
*   **URL:** `http://localhost:3000/docs`

Esta interfaz proporciona una visión completa de todos los endpoints disponibles, parámetros requeridos y esquemas de respuesta.

## Estructura del Proyecto
```text
src/
├── controllers/    # Controladores y DTOs
├── database/       # Entidades de TypeORM y migraciones
├── providers/      # Servicios de lógica de negocio
├── main.ts         # Punto de entrada de la aplicación
└── app.module.ts   # Configuración del módulo raíz
```

---
*Desarrollado para el Proyecto de Modernización de la Cafetería NYU.*
