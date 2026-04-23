import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MealPlan } from '../models/meal-plan';

@Injectable({
  providedIn: 'root'
})
export class MealPlansService {

  private mealPlansMock: MealPlan[] = [
    {
      id: 1,
      nombre: 'Plan basico',
      descripcion: 'Incluye cafe y sadwich',
      precio: 3000,
      tipo: 'BASICO',
      activo: true
    },
    {
      id: 2,
      nombre: 'Plan deluxe',
      descripcion: 'Incluye desayuno y  almuerzo',
      precio: 5000,
      tipo: 'DELUXE',
      activo: true
    },
    {
      id: 3,
      nombre: 'Plan premium',
      descripcion: 'Incluye desayuno, almuerzo y cena',
      precio: 8000,
      tipo: 'PREMIUM',
      activo: false
    }
  ];

  getMealPlans(): Observable<MealPlan[]> {
    return of(this.mealPlansMock);
  }

  createMealPlan(mealPlan: MealPlan): Observable<MealPlan> {
    const newMealPlan = {
      ...mealPlan,
      id: this.mealPlansMock.length + 1
    };

    this.mealPlansMock.push(newMealPlan);
    return of(newMealPlan);
  }
}