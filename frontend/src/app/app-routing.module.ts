import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login/login.component';
import { ClientLayoutComponent } from './features/layout/client-layout/client-layout.component';
import { HomeComponent } from './features/student/home/home.component';
import { MenuComponent } from './features/student/menu/menu.component';
import { ResidentPlanComponent } from './features/student/resident-plan/resident-plan.component';
import { HistoryComponent } from './features/student/history/history.component';
import { CheckoutComponent } from './features/student/checkout/checkout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ResidentGuard } from './core/guards/resident.guard';
import { UsersListComponent } from './features/admin/pages/users-list/users-list.component';
import { RoleGuard } from './core/guards/role.guard';
import { RegisterComponent } from './features/auth/register/register.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: '', 
    component: ClientLayoutComponent, 
    canActivate: [AuthGuard], // <-- PROTEGER TODO EL LAYOUT
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'menu', component: MenuComponent },
      { 
        path: 'resident-plan', 
        component: ResidentPlanComponent,
        canActivate: [ResidentGuard] // <-- REGLA ESTRICTA DE LA RÚBRICA
      },
      { path: 'history', component: HistoryComponent },
      {  path: 'admin/users', component: UsersListComponent,
        canActivate: [RoleGuard] },// ESTO BLOQUEA A LOS CLIENTES 
      { path: 'checkout', component: CheckoutComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }