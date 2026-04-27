import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// ---------------- IMPORTACIÓN DE COMPONENTES ----------------
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ClientLayoutComponent } from './features/layout/client-layout/client-layout.component';
import { AdminLayoutComponent } from './features/layout/admin-layout/admin-layout.component';
import { HomeComponent } from './features/student/home/home.component';
import { MenuComponent } from './features/student/menu/menu.component';
import { ResidentPlanComponent } from './features/student/resident-plan/resident-plan.component';
import { HistoryComponent } from './features/student/history/history.component';
import { CheckoutComponent } from './features/student/checkout/checkout.component';
import { ProfilePageComponent } from './features/profile/pages/profile-page/profile-page.component';

import { UsersListComponent } from './features/admin/pages/users-list/users-list.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { StockAdminComponent } from './features/admin/stock-admin/stock-admin.component';
import { PlansAdminComponent } from './features/admin/plans-admin/plans-admin.component';
import { PromotionsAdminComponent } from './features/admin/promotions-admin/promotions-admin.component';

// ---------------- IMPORTACIÓN DE GUARDS ----------------
import { AuthGuard } from './core/guards/auth.guard';
import { NoAuthGuard } from './core/guards/no-auth.guard'; // Escudo Anti-Login
import { RoleGuard } from './core/guards/role.guard';      // Escudo de Jerarquía
import { ResidentGuard } from './core/guards/resident.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 🔹 ZONA PÚBLICA (Protegida para que los usuarios logueados no puedan volver a entrar)
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [NoAuthGuard] },

  // 🔹 ZONA CLIENTE / ESTUDIANTE
  { 
    path: '', 
    component: ClientLayoutComponent, 
    // PROTEGER TODO EL LAYOUT CLIENTE (Debe tener sesión Y debe ser Cliente)
    canActivate: [AuthGuard, RoleGuard], 
    data: { expectedRole: 'Cliente' },
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'menu', component: MenuComponent },
      { 
        path: 'resident-plan', 
        component: ResidentPlanComponent,
        canActivate: [ResidentGuard] // <-- REGLA ESTRICTA DE LA RÚBRICA (Intacta)
      },
      { path: 'history', component: HistoryComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'profile', component: ProfilePageComponent }
    ]
  },

  // 🔹 ZONA ADMIN (Layout distinto, máxima seguridad)
  {
    path: 'admin',
    component: AdminLayoutComponent,
    // PROTEGER TODO EL LAYOUT ADMIN (Debe tener sesión Y debe ser Administrador)
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'Administrador' },
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'users', component: UsersListComponent }, // <-- CORREGIDO: Lo movimos al layout de Admin
      { path: 'stock', component: StockAdminComponent },
      { path: 'plans', component: PlansAdminComponent },
      { path: 'promotions', component: PromotionsAdminComponent }
    ]
  },

  // 🔹 RUTA COMODÍN (Cualquier URL no reconocida)
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }