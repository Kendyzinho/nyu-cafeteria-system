import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login/login.component';
import { ClientLayoutComponent } from './features/layout/client-layout/client-layout.component';
import { AdminLayoutComponent } from './features/layout/admin-layout/admin-layout.component';
import { HomeComponent } from './features/student/home/home.component';
import { MenuComponent } from './features/student/menu/menu.component';
import { ResidentPlanComponent } from './features/student/resident-plan/resident-plan.component';
import { HistoryComponent } from './features/student/history/history.component';
import { CheckoutComponent } from './features/student/checkout/checkout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ResidentGuard } from './core/guards/resident.guard';
import { UsersListComponent } from './features/admin/pages/users-list/users-list.component';
import { RoleGuard } from './core/guards/role.guard';
import { ProfilePageComponent } from './features/profile/pages/profile-page/profile-page.component';
import { OrderSuccessComponent } from './features/student/order-success/order-success.component';
import { HelpComponent } from './features/student/help/help.component';

import { GuestGuard } from './core/guards/guest.guard';

import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { StockAdminComponent } from './features/admin/stock-admin/stock-admin.component';
import { PlansAdminComponent } from './features/admin/plans-admin/plans-admin.component';
import { PromotionsAdminComponent } from './features/admin/promotions-admin/promotions-admin.component';
import { ProductsAdminComponent } from './features/admin/products-admin/products-admin.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [GuestGuard] }, // <-- PROTEGIDO: Solo si no estás logueado
  { 
    path: '', 
    component: ClientLayoutComponent, 
    canActivate: [AuthGuard], // <-- PROTEGER TODO EL LAYOUT CLIENTE
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'menu', component: MenuComponent },
      { 
        path: 'resident-plan', 
        component: ResidentPlanComponent,
      },
      { path: 'history', component: HistoryComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'order-success', component: OrderSuccessComponent },
      { path: 'help', component: HelpComponent },
      { path: 'profile', component: ProfilePageComponent }
    ]
  },

  // 🔹 ADMIN (IMPORTANTE: layout distinto)
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, RoleGuard], // <-- PROTEGIDO: Solo administradores
    canActivateChild: [AuthGuard, RoleGuard], // <-- PROTECCIÓN INDIVIDUAL DE RUTAS HIJAS
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'stock', component: StockAdminComponent },
      { path: 'plans', component: PlansAdminComponent },
      { path: 'promotions', component: PromotionsAdminComponent },
      { path: 'products', component: ProductsAdminComponent },
      { path: 'users', component: UsersListComponent } // <-- MOVISTE AQUI, dentro de admin
    ]
  },

  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

//