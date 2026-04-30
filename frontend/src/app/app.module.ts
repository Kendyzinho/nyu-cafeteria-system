import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { ClientLayoutComponent } from './features/layout/client-layout/client-layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { HomeComponent } from './features/student/home/home.component';
import { MenuComponent } from './features/student/menu/menu.component';
import { CheckoutComponent } from './features/student/checkout/checkout.component';
import { OrderSuccessComponent } from './features/student/order-success/order-success.component';
import { ResidentPlanComponent } from './features/student/resident-plan/resident-plan.component';
import { HistoryComponent } from './features/student/history/history.component';
import { HelpComponent } from './features/student/help/help.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { StockAdminComponent } from './features/admin/stock-admin/stock-admin.component';
import { PlansAdminComponent } from './features/admin/plans-admin/plans-admin.component';
import { PromotionsAdminComponent } from './features/admin/promotions-admin/promotions-admin.component';
import { AdminLayoutComponent } from './features/layout/admin-layout/admin-layout.component';
import { NavbarAdminComponent } from './shared/components/navbar-admin/navbar-admin.component';
import { UsersAdminComponent } from './features/admin/users-admin/users-admin.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ClientLayoutComponent,
    LoginComponent,
    HomeComponent,
    MenuComponent,
    CheckoutComponent,
    OrderSuccessComponent,
    ResidentPlanComponent,
    HistoryComponent,
    HelpComponent,
    AdminDashboardComponent,
    StockAdminComponent,
    PlansAdminComponent,
    PromotionsAdminComponent,
    AdminLayoutComponent,
    NavbarAdminComponent,
    UsersAdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
