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
  paymentMethod: string = '';
  isProcessing: boolean = false;

  orderSuccess: boolean = false;
  orderNumber: number = 0;
  finalPaidAmount: number = 0;

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

    this.recargarSlots(); // <-- AGREGAR ESTA LÍNEA

    // 2. Carga los datos del carrito original
    this.cartSub = this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.totalAmount = this.cartService.getTotalAmount();
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
    // 1. Validaciones REALES activadas
    if (!this.horarioSeleccionadoIso) {
      this.toastService.show('Por favor selecciona una hora de retiro.', 'warning');
      return;
    }
    
    if (this.cartItems.length === 0) {
      this.toastService.show('Tu carrito está vacío.', 'warning');
      return;
    }

    if (!this.paymentMethod) {
      this.toastService.show('Por favor selecciona un método de pago.', 'warning');
      return;
    }

    if (this.paymentMethod === 'Tarjeta' && this.checkoutForm.invalid) {
      this.toastService.show('Por favor, ingresa los datos válidos de la tarjeta.', 'warning');
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.isProcessing = true;
    const user = this.authService.getCurrentUser();

    // 2. Conexión REAL activada
    if (this.paymentMethod === 'Plan Residente') {
      if (!user?.isResident) {
        this.toastService.show('No eres un Residente activo. No puedes usar este método.', 'danger');
        this.isProcessing = false;
        return;
      }
      this.executeOrderCreation(user);
    } 
    else if (this.paymentMethod === 'Tarjeta') {
      const payloadPago = { 
        email: user?.email, 
        monto: this.totalAmount,
        datosTarjeta: this.checkoutForm.value
      };

      this.integrationService.validarPagoAprobado(payloadPago).subscribe({
        next: ({ aprobado, transactionId }) => {
          if (!aprobado) {
            this.toastService.show('El pago fue rechazado por la pasarela.', 'danger');
            this.isProcessing = false;
            return;
          }
          this.executeOrderCreation(user, transactionId?.toString() ?? null);
        },
        error: () => {
          this.toastService.show('Error conectando a la pasarela de pagos.', 'danger');
          this.isProcessing = false;
        }
      });
    }
  }

  private executeOrderCreation(user: any, ordenPagoId: string | null = null) {
    const payload = {
      usuarioId: user ? user.id : 1,
      items: this.cartItems.map(i => ({
        id: i.product.id,
        cantidad: i.quantity,
        precio: i.product.precio || 0
      })),
      horarioRetiro: this.horarioSeleccionadoIso,
      ordenPagoId
    };

    this.orderService.createOrder(payload).subscribe({
      next: () => {
        this.isProcessing = false;

        // NUEVO: Guardamos una "foto" del total ANTES de vaciar el carrito
        this.finalPaidAmount = this.totalAmount; 

        this.cartService.clearCart(); // Ahora sí, vaciamos el carrito seguro

        // 1. Generamos el número de orden para la boleta
        this.orderNumber = Math.floor(Math.random() * 10000) + 1000; 

        // 2. Activamos el switch para mostrar la pantalla de éxito en el HTML
        this.orderSuccess = true; 

        // 3. Mantenemos tu mensaje verde pequeño (toast) porque es un buen detalle
        const hr = new Date(this.horarioSeleccionadoIso!);
        this.toastService.show(`¡Pedido confirmado! Retira a las ${formatearSlot(hr)}`, 'success');

        // 4. Mantenemos la redirección comentada para que el usuario pueda leer su boleta
        // this.router.navigate(['/history']);
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
