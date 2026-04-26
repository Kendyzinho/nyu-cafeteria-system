import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; // IMPORTANTE
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

// Importaremos el interceptor (lo crearemos en el Paso 3)
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { UsersListComponent } from './features/admin/pages/users-list/users-list.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ProfilePageComponent } from './features/profile/pages/profile-page/profile-page.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { MenuItemComponent } from './features/student/menu/menu-item/menu-item.component';

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
    UsersListComponent,
    RegisterComponent,
    ProfilePageComponent,
    FooterComponent,
    MenuItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule // AÑADIDO AQUÍ
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // REGISTRO DEL INTERCEPTOR
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }