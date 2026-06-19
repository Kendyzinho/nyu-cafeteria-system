# NYU Cafeteria System - Frontend

Este es el proyecto frontend para el sistema de gestión de la cafetería de NYU. Desarrollado con **Angular 18**, proporciona una interfaz de usuario moderna, reactiva y fácil de usar, separando las funcionalidades para administradores y estudiantes.

---

## Tecnologías Principales

- **[Angular](https://angular.dev/) (v18.2.x)**: Framework principal para la construcción de la SPA (Single Page Application).
- **[TypeScript](https://www.typescriptlang.org/)**: Lenguaje principal de desarrollo, ofreciendo tipado estático y orientación a objetos.
- **[RxJS](https://rxjs.dev/)**: Utilizado para la programación reactiva y el manejo de flujos de datos asíncronos.
- **[SweetAlert2](https://sweetalert2.github.io/)**: Para la creación de alertas modales y notificaciones elegantes y personalizadas.
- **HTML5 & CSS3**: Estructuración y estilización de la interfaz de usuario.

---

## Estructura del Proyecto

El proyecto sigue las mejores prácticas de arquitectura de Angular, dividiendo el código en `core`, `features` y `shared`:

```text
src/
└── app/
    ├── core/          # Servicios singleton, guards, interceptors, modelos de datos y constantes globales.
    ├── features/      # Módulos de características agrupados por dominio de la aplicación:
    │   ├── admin/     # Gestión de usuarios, inventario y reportes para administradores.
    │   ├── auth/      # Login, registro y recuperación de contraseña.
    │   ├── checkout/  # Proceso de compra y carrito.
    │   ├── layout/    # Estructura principal de la aplicación.
    │   ├── profile/   # Perfil del usuario y configuración.
    │   └── student/   # Menú de la cafetería, pedidos y opciones para estudiantes.
    └── shared/        # Componentes reutilizables, directivas y pipes (ej. navbars, botones).
```

---

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalados los siguientes componentes:

- [Node.js](https://nodejs.org/) (Versión 18 LTS o superior)
- [npm](https://www.npmjs.com/) (Gestor de paquetes, usualmente instalado con Node.js)
- [Angular CLI](https://angular.io/cli) (Opcional pero recomendado para comandos globales: `npm install -g @angular/cli`)

---

## Instalación y Configuración Local

Sigue estos pasos para levantar el entorno de desarrollo local:

1. **Instalar dependencias:**

   Navega a la carpeta del frontend y ejecuta:
   ```bash
   npm install
   ```

2. **Servidor de desarrollo:**

   Para ejecutar la aplicación en entorno de desarrollo local, utiliza:
   ```bash
   npm start
   ```
   > Alternativamente puedes usar `ng serve`. La aplicación estará disponible en `http://localhost:4200/`. La aplicación se recargará automáticamente si realizas cambios en los archivos fuente.

---

## Scripts Disponibles

En el directorio del proyecto, puedes ejecutar los siguientes comandos predefinidos en `package.json`:

- `npm start`: Inicia el servidor de desarrollo local (`ng serve`).
- `npm run build`: Construye el proyecto para producción. Los artefactos de compilación se almacenarán en el directorio `dist/`.
- `npm run watch`: Inicia la compilación en modo observación (watch mode), ideal para desarrollo continuo.
- `npm test`: Ejecuta las pruebas unitarias vía [Karma](https://karma-runner.github.io).

---

## Creación de Componentes

Para generar nuevos elementos a través de Angular CLI:

```bash
ng generate component nombre-del-componente
```
*También puedes utilizar `ng generate directive|pipe|service|class|guard|interface|enum|module`.*

---

## Contribución

Asegúrate de seguir las convenciones de código y crear ramas (branches) descriptivas para nuevas funcionalidades o correcciones de errores. Ejecuta siempre las pruebas (`npm test`) y verifica que la compilación sea exitosa (`npm run build`) antes de fusionar los cambios.
