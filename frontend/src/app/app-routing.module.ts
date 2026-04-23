import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockListComponent } from './components/Admin/stock/stock-list/stock-list.component';
import { StockFormComponent } from './components/Admin/stock/stock-form/stock-form.component';
import { MealPlanListComponent } from './components/Admin/meal-plans/meal-plan-list/meal-plan-list.component';
import { MealPlanFormComponent } from './components/Admin/meal-plans/meal-plan-form/meal-plan-form.component';
import { PromotionListComponent } from './components/Admin/promotions/promotion-list/promotion-list.component';
import { PromotionFormComponent } from './components/Admin/promotions/promotion-form/promotion-form.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },

  { path: 'stock', component: StockListComponent },
  { path: 'stock/crear', component: StockFormComponent },

  { path: 'meal-plans', component: MealPlanListComponent },
  { path: 'meal-plans/crear', component: MealPlanFormComponent },

  { path: 'promotions', component: PromotionListComponent },
  { path: 'promotions/crear', component: PromotionFormComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }