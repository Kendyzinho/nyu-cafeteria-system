import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MealPlansService } from 'src/app/services/meal-plans.service';

@Component({
  selector: 'app-meal-plan-form',
  templateUrl: './meal-plan-form.component.html',
  styleUrls: ['./meal-plan-form.component.css']
})
export class MealPlanFormComponent {

  mealPlanForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private mealPlansService: MealPlansService,
    private router: Router
  ) {
    this.mealPlanForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      tipo: ['', Validators.required],
      activo: [true]
    });
  }

  actualizarPrecioSegunTipo(): void {
    const tipo = this.mealPlanForm.get('tipo')?.value;

    if (tipo === 'BASICO') {
      this.mealPlanForm.patchValue({ precio: 3000 });
    } else if (tipo === 'COMPLETO') {
      this.mealPlanForm.patchValue({ precio: 5000 });
    } else if (tipo === 'PREMIUM') {
      this.mealPlanForm.patchValue({ precio: 8000 });
    } else {
      this.mealPlanForm.patchValue({ precio: '' });
    }
  }

  guardarPlan(): void {
    if (this.mealPlanForm.invalid) {
      this.mealPlanForm.markAllAsTouched();
      this.errorMessage = 'Completa todos los campos correctamente.';
      this.successMessage = '';
      return;
    }

    const nuevoPlan = {
      ...this.mealPlanForm.value,
      id: 0
    };

    this.mealPlansService.createMealPlan(nuevoPlan).subscribe({
      next: () => {
        this.successMessage = 'Plan guardado correctamente';
        this.errorMessage = '';

        setTimeout(() => {
          this.router.navigate(['/meal-plans']);
        }, 800);
      },
      error: () => {
        this.errorMessage = 'Error al guardar plan';
        this.successMessage = '';
      }
    });
  }
}