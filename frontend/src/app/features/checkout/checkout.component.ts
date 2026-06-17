import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Inicializamos el formulario con reglas estrictas
    this.checkoutForm = this.fb.group({
      titular: ['', [Validators.required, Validators.minLength(3)]],
      numeroTarjeta: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]], // Solo 16 números
      fechaVencimiento: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/?([0-9]{2})$')]], // Formato MM/AA
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]] // 3 o 4 números
    });
  }

  procesarPago(): void {
    if (this.checkoutForm.valid) {
      // Si todo está correcto, imprimimos los datos listos para el backend
      console.log('Datos validados, listos para enviar a la API de Felipe:', this.checkoutForm.value);
      // Aquí agregaremos el llamado al servicio HTTP más adelante
    } else {
      // Marcamos todos los campos como "tocados" para que salten los errores en rojo
      this.checkoutForm.markAllAsTouched();
      console.log('Faltan datos o hay errores en la tarjeta');
    }
  }
}