import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService, CartItem } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { IntegrationService } from '../../../core/services/integration.service';
import { ToastService } from '../../../core/services/toast.service';
import { formatearSlot, getSlotsDisponiblesHoy } from '../../../core/constants/cafeteria-horario';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  checkoutForm!: FormGroup;
  cartItems: CartItem[] = [];
  totalAmount: number = 0;
  private cartSub!: Subscription;

  slotsDisponibles: Date[] = [];
  horarioSeleccionadoIso: string | null = null;
  paymentMethod: string = 'Tarjeta';
  isProcessing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private integrationService: IntegrationService,
    private toastService: ToastService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    // 1. Construye el formulario con sus reglas
    this.checkoutForm = this.fb.group({
      titular: ['', [Validators.required, Validators.minLength(3)]],
      numeroTarjeta: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      fechaVencimiento: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])/?([0-9]{2})$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]]
    });

    // 2. Carga los datos del carrito original
    this.cartSub = this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.totalAmount = this.cartService.getTotalAmount();
    
    const horaFalsa = new Date();
    horaFalsa.setHours(12, 30, 0, 0);
    this.slotsDisponibles = [horaFalsa];
    this.horarioSeleccionadoIso = horaFalsa.toISOString();
    });
  }
  ngOnDestroy(): void {
    if (this.cartSub) this.cartSub.unsubscribe();
  }

  recargarSlots() {
    this.slotsDisponibles = getSlotsDisponiblesHoy();
    if (this.horarioSeleccionadoIso) {
      const sigueDisponible = this.slotsDisponibles.some(
        s => s.toISOString() === this.horarioSeleccionadoIso,
      );
      if (!sigueDisponible) this.horarioSeleccionadoIso = null;
    }
  }

  formatearSlot(fecha: Date): string {
    return formatearSlot(fecha);
  }

  updateQuantity(item: CartItem, change: number) {
    this.cartService.updateQuantity(item.product.id, item.quantity + change);
  }

  removeItem(item: CartItem) {
    this.cartService.removeItem(item.product.id);
  }

  confirmOrder() {
    // 1. Verificamos que el carrito tenga algo
    if (this.cartItems.length === 0) {
      this.toastService.show('Tu carrito está vacío.', 'warning');
      return;
    }

    // 2. Verificamos que tu formulario de la tarjeta esté perfecto
    if (this.paymentMethod === 'Tarjeta' && this.checkoutForm.invalid) {
      this.toastService.show('Revisa los datos de la tarjeta. Deben ser 16 números y un CVV válido.', 'warning');
      this.checkoutForm.markAllAsTouched(); // Pinta los bordes rojos
      return;
    }

    // 3. ¡Todo está bien! Encendemos el botón de "Procesando..."
    this.isProcessing = true;

    // 4. Simulamos que estamos esperando a la pasarela (2 segundos)
    setTimeout(() => {
      this.isProcessing = false; // Apagamos el spinner
      
      // Lanzamos la alerta verde de éxito usando el servicio que ya tienes
      this.toastService.show('¡Pago procesado con éxito! Tu pedido está confirmado.', 'success');
      
      // Opcional: Aquí podrías vaciar el carrito ficticio para que quede en $0
      // this.cartItems = [];
      // this.totalAmount = 0;
      
    }, 2000);
  }

  private executeOrderCreation(user: any) {
    const payload = {
      usuarioId: user ? user.id : 1, 
      items: this.cartItems.map(i => ({
        comidaId: i.product.id,
        cantidad: i.quantity,
        precioUnitario: i.product.precio || 0
      })),
      horarioRetiro: this.horarioSeleccionadoIso
    };

    this.orderService.createOrder(payload).subscribe({
      next: () => {
        this.isProcessing = false;
        this.cartService.clearCart();
        const hr = new Date(this.horarioSeleccionadoIso!);
        this.toastService.show(`¡Pedido confirmado! Retira a las ${formatearSlot(hr)}`, 'success');
        this.router.navigate(['/history']);
      },
      error: (err: any) => {
        console.error('Error al procesar orden', err);
        let errorMsg = 'Hubo un problema procesando tu orden internamente.';
        if (err.error && err.error.message) {
          errorMsg = err.error.message;
        }
        this.recargarSlots();
        this.toastService.show(errorMsg, 'danger');
        this.isProcessing = false;
      }
    });
  }
}
