import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PromotionsService } from 'src/app/services/promotions.service';

@Component({
  selector: 'app-promotion-form',
  templateUrl: './promotion-form.component.html',
  styleUrls: ['./promotion-form.component.css']
})
export class PromotionFormComponent {

  promotionForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private promotionsService: PromotionsService
  ) {
    this.promotionForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      descuento: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      activa: [true]
    });
  }

  guardarPromocion(): void {
    if (this.promotionForm.invalid) {
      this.promotionForm.markAllAsTouched();
      return;
    }

    const nuevaPromocion = {
      ...this.promotionForm.value,
      id: 0
    };

    this.promotionsService.createPromotion(nuevaPromocion).subscribe({
      next: () => {
        this.successMessage = 'Promoción guardada correctamente';
        this.errorMessage = '';
        this.promotionForm.reset({ activa: true });
      },
      error: () => {
        this.errorMessage = 'Error al guardar promoción';
        this.successMessage = '';
      }
    });
  }
}