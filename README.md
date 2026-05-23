# Sistema de Cafetería y Planes de Alimentación NYU (Problema 4)

Este repositorio contiene la solución completa para el **Problema 4: Sistema de Cafetería y Planes de Alimentación** del ecosistema de la Universidad de New York (NYU). Desarrollado como un sistema web Fullstack utilizando **Angular** (Frontend) y **NestJS** (Backend).

El objetivo principal de este módulo es centralizar los pedidos de la cafetería y los planes alimentarios para estudiantes regulares y residentes, con un estricto control de stock y aplicación de beneficios automáticos.

---

## 👥 Equipo de Trabajo y Roles (Taller de Aplicaciones Web)

*   **Líder de Equipo (QA y Merge):** [Nombre del Líder]
*   **Subequipo Frontend (Angular):** [Nombre(s) Frontend]
*   **Subequipo Backend (NestJS):** [Nombre(s) Backend]

*Metodología de desarrollo:* [Ej. Scrum / Kanban]

---

## 🎯 Requisitos Funcionales Implementados (Problema 4)

Se han implementado con éxito los siguientes requerimientos obligatorios:

1. **Gestión de menú por día/categoría:** Panel de administrador para crear y categorizar productos. Interfaz de estudiante con filtrado por categoría en tiempo real.
2. **Registro de stock y bloqueo:** Control de inventario dinámico. Si un producto llega a stock 0, se bloquea automáticamente ("Agotado") impidiendo nuevas compras.
3. **Pedidos individuales con retiro:** Carrito de compras (`CartService`) y pasarela de Checkout donde el estudiante selecciona la hora de retiro programado.
4. **Planes alimentarios para residentes:** Suscripción a planes mensuales dinámicos traídos desde la base de datos, exclusivos para residentes de NYU.
5. **Historial de consumos:** Panel de historial de transacciones para que el estudiante revise sus pedidos y consumos anteriores.
6. **Gestión de promociones:** Aplicación de beneficios y descuentos según el perfil de usuario (ej. Estudiante Activo, Residente).

### Reglas de Negocio Clave
*   🚫 *No se confirma pedido sin pago aprobado* (Simulado en la integración del checkout).
*   🏠 *Plan residencial aplica solo a estudiantes con residencia activa* (Validado mediante Guards y Servicios de Integración).
*   🎓 *Descuento universitario aplica solo a estudiantes activos* (Validado mediante el Auth Service).

---

## 🔌 Integraciones del Ecosistema (APIs)

Esta aplicación forma parte del ecosistema NYU y está diseñada para comunicarse e interoperar con los demás sistemas de la universidad:

*   **Integración Eq. 5 (Sistema de Pagos):** El sistema emite la orden de cobro a la pasarela central y espera la confirmación (estado aprobado) para registrar el pedido o la activación del plan.
*   **Integración Eq. 2 (Sistema de Alojamiento):** Se consume el estado del residente. Si un usuario tiene residencia activa (check-in), se le habilita la suscripción al Plan de Alimentación.
*   **Integración Eq. 1 (Sistema de Matrícula):** Se valida el estado académico (estudiante activo) para aplicar descuentos universitarios y permitir compras en el catálogo.
*   **Integración Eq. 3 (Sistema de Biblioteca):** Se recibe la demanda proyectada desde las reservas de la biblioteca para anticipar horarios punta o críticos en el *Dashboard del Administrador*.

---

## 🚀 Guía de Instalación y Ejecución Local

Para ejecutar y evaluar este proyecto en un entorno local, se requiere **Node.js** y **Angular CLI**.

### 1. Clonar el repositorio
```bash
git clone https://github.com/Kendyzinho/nyu-cafeteria-system.git
cd nyu-cafeteria-system
```

### 2. Levantar el Servidor Backend (NestJS)
Abre una terminal y dirígete a la carpeta del backend:
```bash
cd backend
npm install
# Ejecutar el servidor en modo desarrollo
npm run start:dev
```
*El backend estará corriendo en `http://localhost:3000`. La documentación de la API (Swagger) se encuentra en `http://localhost:3000/docs`.*

### 3. Levantar el Cliente Frontend (Angular)
Abre una segunda terminal y dirígete a la carpeta del frontend:
```bash
cd frontend
npm install
# Ejecutar la aplicación web
ng serve
```

### 4. Accesos de Prueba al Sistema
Una vez levantados ambos entornos, ingresa a `http://localhost:4200` y utiliza las siguientes credenciales para probar los roles y flujos del sistema:

*   **Perfil Administrador (Gestión, Stock, Planes):**
    *   Correo: `admin@nyu.edu`
    *   Clave: `admin123`
*   **Perfil Estudiante (Menú, Checkout, Plan Residente):**
    *   Correo: `student@nyu.edu`
    *   Clave: `student123`

---

## 🛡️ Estándares Técnicos Aplicados

*   **Frontend (Angular):** Arquitectura basada en Componentes, Directivas estructurales (`*ngIf`, `*ngFor`), Data Binding bidireccional, Observables (RxJS), consumo de API HTTP, e interceptores JWT. Estilizado con Bootstrap 5.
*   **Backend (NestJS):** Patrón Repository con TypeORM, validación estricta con class-validator (DTOs), Guards para control de rutas por Rol, y autenticación JWT.
