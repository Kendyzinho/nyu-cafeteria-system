# NYU Cafeteria Management System

Sistema integral de gestión de servicios de alimentación diseñado para la comunidad universitaria. Esta plataforma optimiza el flujo de atención, el control de inventarios, la gestión de usuarios y la suscripción a planes residenciales mediante una arquitectura moderna, segura y escalable.

---

## Descripción General

La plataforma opera como un ecosistema dual (B2C y B2B) que atiende tanto a los estudiantes/staff (clientes) como al personal administrativo de la cafetería. Su arquitectura desacoplada permite una experiencia de usuario fluida e interacciones en tiempo real mediante un cliente reactivo (Angular) y una API robusta (NestJS).

### Objetivos Centrales
- **Digitalización del Catálogo**: Ofrecer un menú interactivo con control de stock en tiempo real.
- **Gestión Integral de Alojamiento**: Administrar de manera eficiente los beneficios y planes alimenticios exclusivos para residentes del campus.
- **Administración Centralizada**: Proveer al personal administrativo de un panel de control avanzado para la gestión de usuarios, inventario y promociones.
- **Máxima Seguridad**: Garantizar el resguardo de la información mediante autenticación basada en tokens (JWT) y autorización estricta por roles.

---

## Stack Tecnológico y Arquitectura

El proyecto está dividido en dos capas fundamentales, comunicadas mediante una API RESTful estándar:

### Frontend (Cliente)
* **Core Framework:** Angular (TypeScript).
* **UI/UX Design:** Interfaz "Premium Aesthetic" con diseño adaptativo usando Bootstrap 5, complementado con variables CSS personalizadas y efectos de Glassmorphism.
* **Gestión de Estado:** Programación reactiva con RxJS (BehaviorSubject y Observables).
* **Seguridad (Guards & Interceptors):** Implementación de escudos de navegación (AuthGuard, RoleGuard, GuestGuard, ResidentGuard) e interceptores HTTP para la inyección y validación automática de tokens JWT.

### Backend (Servidor)
* **Core Framework:** NestJS (Node.js).
* **Persistencia de Datos:** TypeORM sobre base de datos relacional (SQL).
* **Validación:** Uso extensivo de Pipes y DTOs (Data Transfer Objects) para la sanitización de solicitudes HTTP.
* **Seguridad:** Módulos de autenticación Passport/JWT y encriptación robusta de credenciales.

---

## Módulos y Características

### Módulo Estudiante / Staff
* **Autenticación Segura:** Ingreso al sistema mediante credenciales institucionales.
* **Perfil Interactivo:** Visualización de credenciales y estado del beneficio universitario.
* **Plan de Residente:** Panel de control ("Mi Plan") para usuarios de alojamiento. Permite visualizar comidas restantes, renovaciones y establecer preferencias alimentarias (ej. Vegano, Celiaco).
* **Catálogo en Vivo:** Menú reactivo que refleja la disponibilidad de productos en tiempo real, con carrito de compras integrado.

### Módulo Administrador
* **Gestión de Usuarios:** Panel avanzado para editar, suspender o dar de baja cuentas de la comunidad universitaria. Nota: La creación de cuentas está restringida a nivel de base de datos por políticas de seguridad.
* **Control de Stock Dinámico:** Inventario inteligente que evalúa automáticamente el estado de los productos (Agotado, Bajo Stock, Disponible) y bloquea ventas de artículos agotados.
* **Gestión de Planes y Promociones:** Interfaz para crear o dar de baja promociones estacionales y planes alimenticios.

---

## Estructura del Código Fuente (Frontend)

El repositorio sigue un patrón de diseño modular estricto para asegurar la mantenibilidad y escalabilidad del código:

```text
src/
├── app/
│   ├── core/           # Motor del sistema: Guards, Interceptors, Modelos y Servicios de API.
│   ├── features/       # Módulos aislados (Auth, Admin Dashboard, Student App).
│   ├── shared/         # Componentes transversales (Navbars adaptativos, Modales, Loaders).
│   └── app.module.ts   # Orquestador principal y enrutamiento base.
├── assets/             # Recursos estáticos e iconografía vectorial (SVG).
└── styles.css          # Sistema de diseño centralizado (Tipografía Inter, Paleta de Colores NYU).
```

---

## Estándares de Seguridad y Calidad
Este proyecto fue construido siguiendo estrictamente métricas de evaluación de software de nivel industrial:
1. **Control de Accesos:** Rutas absolutamente bloqueadas según estado de sesión y rol del usuario (RBAC).
2. **Validación Bidireccional:** Formularios reactivos en frontend apoyados por validadores de clase (Pipes) en el backend.
3. **Manejo de Errores Silencioso:** Captura global de excepciones HTTP para evitar colapsos en la UI, garantizando la continuidad operativa.
4. **Clean Code:** Adopción de convenciones de nomenclatura (CamelCase, PascalCase), inyección de dependencias coherente y abstracción de la lógica de negocio en servicios centralizados.
