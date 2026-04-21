import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ProfilePageComponent } from './pages/profile/profile-page/profile-page.component';
import { UsersListComponent } from './pages/admin/users/users-list/users-list.component';
import { ProductsListComponent } from './pages/admin/products/products-list/products-list.component';
import { ProductFormComponent } from './pages/admin/products/product-form/product-form.component';
import { MenuDayFormComponent } from './pages/admin/menu/menu-day-form/menu-day-form.component';
import { MenuListComponent } from './pages/menu/menu-list/menu-list.component';
import { MenuCardComponent } from './components/menu-card/menu-card.component';
import { MenuFilterComponent } from './components/menu-filter/menu-filter.component';
import { OrderCreateComponent } from './pages/orders/order-create/order-create.component';
import { OrderHistoryComponent } from './pages/orders/order-history/order-history.component';
import { OrderDetailComponent } from './pages/orders/order-detail/order-detail.component';
import { PaymentPageComponent } from './pages/payments/payment-page/payment-page.component';
import { ConsumptionHistoryComponent } from './pages/consumption/consumption-history/consumption-history.component';
import { CartComponent } from './components/cart/cart.component';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { StockListComponent } from './pages/admin/stock/stock-list/stock-list.component';
import { StockFormComponent } from './pages/admin/stock/stock-form/stock-form.component';
import { MealPlanListComponent } from './pages/meal-plans/meal-plan-list/meal-plan-list.component';
import { PromotionListComponent } from './pages/promotions/promotion-list/promotion-list.component';
import { StudentLayoutComponent } from './student-layout.component';
import { AdminLayoutComponent } from './admin-layout.component';
import { WorkerLayoutComponent } from './worker-layout.component';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { WorkerDashboardComponent } from './worker-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ProfilePageComponent,
    UsersListComponent,
    ProductsListComponent,
    ProductFormComponent,
    MenuDayFormComponent,
    MenuListComponent,
    MenuCardComponent,
    MenuFilterComponent,
    OrderCreateComponent,
    OrderHistoryComponent,
    OrderDetailComponent,
    PaymentPageComponent,
    ConsumptionHistoryComponent,
    CartComponent,
    OrderSummaryComponent,
    StockListComponent,
    StockFormComponent,
    MealPlanListComponent,
    PromotionListComponent,
    StudentLayoutComponent,
    AdminLayoutComponent,
    WorkerLayoutComponent,
    AdminDashboardComponent,
    WorkerDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
