import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';

// Layouts
import { StudentLayoutComponent } from './student-layout.component';
import { AdminLayoutComponent } from './admin-layout.component';
import { WorkerLayoutComponent } from './worker-layout.component';

// Pages
import { MenuListComponent } from './pages/menu/menu-list/menu-list.component';
import { OrderCreateComponent } from './pages/orders/order-create/order-create.component';
import { OrderHistoryComponent } from './pages/orders/order-history/order-history.component';
import { ConsumptionHistoryComponent } from './pages/consumption/consumption-history/consumption-history.component';
import { MealPlanListComponent } from './pages/meal-plans/meal-plan-list/meal-plan-list.component';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { MenuDayFormComponent } from './pages/admin/menu/menu-day-form/menu-day-form.component';
import { WorkerDashboardComponent } from './worker-dashboard.component';
import { UsersListComponent } from './pages/admin/users/users-list/users-list.component';
import { ProductsListComponent } from './pages/admin/products/products-list/products-list.component';

const routes: Routes = [
  // Rutas de autenticación (sin layout principal)
  { path: 'login', component: LoginComponent },

  // Rutas para Estudiantes (layout por defecto)
  {
    path: '',
    component: StudentLayoutComponent,
    // canActivate: [AuthGuard], data: { roles: ['student'] } // TODO: Proteger rutas
    children: [
      { path: '', redirectTo: 'menu', pathMatch: 'full' },
      { path: 'menu', component: MenuListComponent },
      { path: 'order', component: OrderCreateComponent },
      { path: 'my-orders', component: OrderHistoryComponent },
      { path: 'history', component: ConsumptionHistoryComponent },
      { path: 'plans', component: MealPlanListComponent },
    ]
  },

  // Rutas para Administradores
  {
    path: 'admin',
    component: AdminLayoutComponent,
    // canActivate: [AuthGuard], data: { roles: ['admin'] } // TODO: Proteger rutas
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'users', component: UsersListComponent },
      { path: 'products', component: ProductsListComponent },
      { path: 'menu', component: MenuDayFormComponent },
    ]
  },

  // Rutas para Trabajadores
  {
    path: 'worker',
    component: WorkerLayoutComponent,
    // canActivate: [AuthGuard], data: { roles: ['worker'] } // TODO: Proteger rutas
    children: [
      { path: '', component: WorkerDashboardComponent },
      // TODO: Agregar más rutas para trabajadores, ej: gestionar órdenes
    ]
  },

  // Redirección para rutas no encontradas
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
