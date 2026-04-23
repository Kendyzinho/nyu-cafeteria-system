import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-stock-form',
  templateUrl: './stock-form.component.html',
  styleUrls: ['./stock-form.component.css']
})
export class StockFormComponent {

  stockForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private stockService: StockService
  ) {
    this.stockForm = this.fb.group({
      menuItemId: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(0)]],
      umbralMinimo: ['', [Validators.required, Validators.min(0)]]
    });
  }

  guardarStock(): void {
    if (this.stockForm.invalid) {
      this.stockForm.markAllAsTouched();
      return;
    }

    const nuevoStock = {
      ...this.stockForm.value,
      id: 0,
      ultimaActualizacion: ''
    };

    this.stockService.createStock(nuevoStock).subscribe({
      next: () => {
        this.successMessage = 'Stock guardado correctamente';
        this.errorMessage = '';
        this.stockForm.reset();
      },
      error: () => {
        this.errorMessage = 'Error al guardar stock';
        this.successMessage = '';
      }
    });
  }
} 