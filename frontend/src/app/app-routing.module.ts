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

import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { StockAdminComponent } from './features/admin/stock-admin/stock-admin.component';
import { PlansAdminComponent } from './features/admin/plans-admin/plans-admin.component';
import { PromotionsAdminComponent } from './features/admin/promotions-admin/promotions-admin.component';
import { UsersAdminComponent } from './features/admin/users-admin/users-admin.component';

import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // 🔹 CLIENTE (estudiante) - Protegido con AuthGuard
  {
    path: '',
    component: ClientLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'menu', component: MenuComponent },
      { path: 'resident-plan', component: ResidentPlanComponent },
      { path: 'history', component: HistoryComponent },
      { path: 'checkout', component: CheckoutComponent }
    ]
  },

  // 🔹 ADMIN - Protegido con AdminGuard (requiere rol admin)
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'stock', component: StockAdminComponent },
      { path: 'users', component: UsersAdminComponent },
      { path: 'plans', component: PlansAdminComponent },
      { path: 'promotions', component: PromotionsAdminComponent }
    ]
  },

  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }