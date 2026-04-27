# ☕ Sistema de Gestión Integrado - Cafetería Estudiantil

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)

Este proyecto corresponde al desarrollo del frontend (Single Page Application) para la resolución del **Problema 4: Gestión de Cafetería**, desarrollado como proyecto semestral de Ingeniería de Software en la Universidad de Tarapacá (Sede Arica). 

El sistema digitaliza y optimiza el flujo de atención, inventario y suscripción de planes de alimentación para la comunidad universitaria.

## 📋 Descripción General

La plataforma actúa como un ecosistema dual que atiende tanto a los estudiantes (clientes) como al personal de la cafetería (administradores). Su arquitectura permite una gestión de estado reactiva en tiempo real sin necesidad de recargar la página, ofreciendo una experiencia fluida.

### 🎯 Objetivos del Proyecto (Sprints)
- Digitalizar el menú y permitir compras ágiles.
- Gestionar planes residenciales y beneficios de alimentación.
- Proveer al staff de un panel de control para inventario y usuarios.
- Implementar seguridad mediante enrutamiento basado en roles (JWT simulado).

---

## 🚀 Tecnologías y Arquitectura

* **Framework Core:** Angular (TypeScript)
* **Estilos y UI:** Bootstrap 5 (Responsive Design)
* **Gestión de Estado:** RxJS (`BehaviorSubject` y Observables para sincronización en tiempo real entre componentes).
* **Seguridad:** Angular Route Guards (`AuthGuard`, `RoleGuard`) e Interceptors.
* **Mocking:** Servicios inyectables con bases de datos en memoria para el desarrollo del Frontend previo a la integración con la API RESTful.

---

## ⚙️ Características Principales (Módulos)

### 🧑‍🎓 Módulo Estudiante / Residente
* **Autenticación:** Registro e inicio de sesión inteligente.
* **Mi Perfil:** Visualización de credenciales y estado del beneficio universitario.
* **Gestión de Plan:** Panel de control ("Mi Plan") para visualizar comidas restantes, renovaciones automáticas y definición de preferencias alimentarias (Vegano, Celiaco, etc.).
* **Catálogo Interactivo:** Menú reactivo que refleja la disponibilidad de productos en tiempo real.

### 🛡️ Módulo Administrador / Staff
* **Gestión de Usuarios:** Tabla dinámica con persistencia para suspender/activar cuentas de estudiantes o ver sus planes asociados.
* **Control de Stock Vivo:** Panel de inventario que calcula automáticamente el estado del producto ("Agotado", "Poco Stock", "Disponible") basado en umbrales mínimos, bloqueando las ventas en el catálogo del cliente si el stock llega a 0.

---

## 📁 Estructura del Proyecto

El código fuente sigue las mejores prácticas de modularidad de Angular:

```text
src/
├── app/
│   ├── core/           # Servicios (Auth, Menu, Users), Modelos, Guards e Interceptors.
│   ├── features/       # Módulos principales (Auth, Admin, Student).
│   ├── shared/         # Componentes reutilizables (Navbar, Footer, Loaders).
│   ├── layouts/        # Estructuras de página (ClientLayout vs AuthLayout).
│   └── app.module.ts   # Módulo raíz.
├── assets/             # Imágenes y recursos estáticos.
└── styles.css          # Estilos globales y variables de color (Paleta Corporativa).
