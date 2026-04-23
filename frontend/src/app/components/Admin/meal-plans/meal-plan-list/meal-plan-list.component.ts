import { Component, OnInit } from '@angular/core';
import { MealPlan } from 'src/app/models/meal-plan';
import { MealPlansService } from 'src/app/services/meal-plans.service';

@Component({
  selector: 'app-meal-plan-list',
  templateUrl: './meal-plan-list.component.html',
  styleUrls: ['./meal-plan-list.component.css']
})
export class MealPlanListComponent implements OnInit {

  mealPlans: MealPlan[] = [];
  errorMessage = '';

  constructor(private mealPlansService: MealPlansService) {}

  ngOnInit(): void {
    this.cargarPlanes();
  }

  cargarPlanes(): void {
    this.mealPlansService.getMealPlans().subscribe({
      next: (data) => {
        this.mealPlans = data;
      },
      error: () => {
        this.errorMessage = 'Error al cargar planes alimentarios';
      }
    });
  }
}