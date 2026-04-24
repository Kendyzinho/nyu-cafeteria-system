import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
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
    HelpComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }