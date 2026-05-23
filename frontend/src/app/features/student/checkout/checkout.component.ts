import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService, CartItem } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { IntegrationService } from '../../../core/services/integration.service';
import { ToastService } from '../../../core/services/toast.service';
import { formatearSlot, getSlotsDisponiblesHoy } from '../../../core/constants/cafeteria-horario';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  totalAmount: number = 0;
  private cartSub!: Subscription;

  slotsDisponibles: Date[] = [];
  horarioSeleccionadoIso: string | null = null;
  paymentMethod: string = 'Tarjeta';
  isProcessing: boolean = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private integrationService: IntegrationService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartSub = this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.totalAmount = this.cartService.getTotalAmount();
    });
    this.recargarSlots();
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
    if (!this.horarioSeleccionadoIso) {
      this.toastService.show('Por favor selecciona una hora de retiro.', 'warning');
      return;
    }
    
    if (this.cartItems.length === 0) {
      this.toastService.show('Tu carrito está vacío.', 'warning');
      return;
    }

    this.isProcessing = true;
    const user = this.authService.getCurrentUser();

    // Regla de Negocio: Validar Plan Residente
    // Bypass temporal de validación de Residencia
    if (false && this.paymentMethod === 'Plan Residente') {
      if (!user?.isResident) {
        this.toastService.show('No eres un Residente activo. No puedes usar este método de pago.', 'danger');
        this.isProcessing = false;
        return;
      }
      this.executeOrderCreation(user);
    } 
    // Regla de Negocio: Validar Tarjeta (Pasarela Equipo 5)
    else {
      const payloadPago = { email: user?.email, monto: this.totalAmount };
      this.integrationService.validarPagoAprobado(payloadPago).subscribe({
        next: (pagoAprobado) => {
          if (!pagoAprobado) {
            this.toastService.show('El pago fue rechazado por la pasarela.', 'danger');
            this.isProcessing = false;
            return;
          }
          this.executeOrderCreation(user);
        },
        error: () => {
          this.toastService.show('Error conectando a la pasarela de pagos.', 'danger');
          this.isProcessing = false;
        }
      });
    }
  }

  private executeOrderCreation(user: any) {
    const payload = {
      usuarioId: user ? user.id : 1, 
      items: this.cartItems.map(i => ({
        productId: i.product.id,
        quantity: i.quantity,
        price: i.product.precio_estudiante || i.product.precio || 0
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
