import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // Añadido HTTP_INTERCEPTORS
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

// Componentes
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
import { UsersListComponent } from './features/admin/pages/users-list/users-list.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ProfilePageComponent } from './features/profile/pages/profile-page/profile-page.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { MenuItemComponent } from './features/student/menu/menu-item/menu-item.component';

// Interceptores
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

@NgModule({ declarations: [
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
        UsersListComponent,
        RegisterComponent,
        ProfilePageComponent,
        FooterComponent,
        MenuItemComponent,
        // --- LA SOLUCIÓN: Agregamos los componentes de Admin que faltaban ---
        AdminLayoutComponent,
        NavbarAdminComponent,
        AdminDashboardComponent,
        StockAdminComponent,
        PlansAdminComponent,
        PromotionsAdminComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule], providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }