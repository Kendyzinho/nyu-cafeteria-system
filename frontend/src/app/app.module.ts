import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StockListComponent } from './components/Admin/stock/stock-list/stock-list.component';
import { StockFormComponent } from './components/Admin/stock/stock-form/stock-form.component';
import { MealPlanListComponent } from './components/Admin/meal-plans/meal-plan-list/meal-plan-list.component';
import { MealPlanFormComponent } from './components/Admin/meal-plans/meal-plan-form/meal-plan-form.component';
import { PromotionListComponent } from './components/Admin/promotions/promotion-list/promotion-list.component';
import { PromotionFormComponent } from './components/Admin/promotions/promotion-form/promotion-form.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    StockListComponent,
    StockFormComponent,
    MealPlanListComponent,
    MealPlanFormComponent,
    PromotionListComponent,
    PromotionFormComponent,
    MealPlanListComponent,
    MealPlanFormComponent,
    PromotionListComponent,
    PromotionFormComponent,
    NavbarComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }