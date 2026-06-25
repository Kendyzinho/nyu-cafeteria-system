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
import { PlanService } from '../../../core/services/plan.service';
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
  ticketItems: CartItem[] = [];
  ticketHorario: string | null = null;
  ticketMetodoPago: string = '';
  planEstado: any = null;
  currentUser: any = null;
  
  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private integrationService: IntegrationService,
    private toastService: ToastService,
    private planService: PlanService,
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

    this.recargarSlots();
const user = this.authService.getCurrentUser();
if (user) {
  this.currentUser = user;

  this.orderService.getDescuento(user.id).subscribe({
    next: (data) => {
      this.descuentoPorcentaje = data.porcentajeDescuento ?? 0;
      this.promocionAplicada = data.promocionAplicada ?? null;
    },
    error: () => { this.descuentoPorcentaje = 0; }
  });

  this.planService.getEstadoPlan(user.id).subscribe({
    next: (data) => { this.planEstado = data; },
    error: () => { this.planEstado = null; }
  });
}
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
  if (this.paymentMethod === 'Plan') {
  if (!this.planEstado) {
    this.toastService.show('No tienes un plan activo.', 'danger');
    this.isProcessing = false;
    return;
  }
  if (!this.tieneUsoDiarioDisponible) {
    this.toastService.show('Ya usaste tu cupo de hoy. Vuelve mañana.', 'danger');
    this.isProcessing = false;
    return;
  }
  if (this.usosRestantes <= 0) {
    this.toastService.show('No tienes usos disponibles en tu plan este mes.', 'danger');
    this.isProcessing = false;
    return;
  }
  this.executeOrderCreation(user, null, 'Plan');
}
    else if (this.paymentMethod === 'Tarjeta') {
      const payloadPago = { 
        email: user?.email, 
        monto: this.totalConDescuento,
        datosTarjeta: this.checkoutForm.value
      };

      this.integrationService.validarPagoAprobado(payloadPago).subscribe({
        next: ({ aprobado, transactionId }) => {
          if (!aprobado) {
            this.toastService.show('El pago fue rechazado por la pasarela.', 'danger');
            this.isProcessing = false;
            return;
          }
          this.executeOrderCreation(user, transactionId?.toString() ?? null, 'Tarjeta');
        },
        error: () => {
          this.toastService.show('Error conectando a la pasarela de pagos.', 'danger');
          this.isProcessing = false;
        }
      });
    }
  }

  private executeOrderCreation(user: any, ordenPagoId: string | null = null, metodoPago: string = '') {
const payload = {
  usuarioId: user ? user.id : 1,
  items: this.cartItems.map(i => ({
    id: i.product.id,
    cantidad: i.quantity,
    precio: i.product.precio || 0
  })),
  horarioRetiro: this.horarioSeleccionadoIso,
  ordenPagoId,
  metodoPago: metodoPago || undefined
};

    this.orderService.createOrder(payload).subscribe({
      next: (pedido) => {
        this.isProcessing = false;

        this.finalPaidAmount = this.totalConDescuento;
        this.ticketItems = [...this.cartItems];
        this.ticketHorario = this.horarioSeleccionadoIso;
        this.ticketMetodoPago = metodoPago;

        this.cartService.clearCart();

        this.orderNumber = pedido?.id ?? Math.floor(Math.random() * 10000) + 1000;
        this.orderSuccess = true;

        if (metodoPago === 'Plan') {
          const u = this.authService.getCurrentUser();
          if (u) {
            this.planService.getEstadoPlan(u.id).subscribe({
              next: (data) => { this.planEstado = data; },
              error: () => { this.planEstado = null; }
            });
          }
        }

        const hr = new Date(this.horarioSeleccionadoIso!);
        this.toastService.show(`¡Pedido confirmado! Retira a las ${formatearSlot(hr)}`, 'success');
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
descuentoPorcentaje: number = 0;
promocionAplicada: string | null = null;

get totalConDescuento(): number {
  if (this.descuentoPorcentaje <= 0) return this.totalAmount;
  return this.totalAmount * (1 - this.descuentoPorcentaje / 100);
  
}
get usosRestantes(): number {
  if (!this.planEstado) return 0;
  return (this.planEstado.plan?.cantidadComidas ?? 0) - (this.planEstado.comidasUsadas ?? 0);
}

get totalCartQuantity(): number {
  return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
}

get tieneUsoDiarioDisponible(): boolean {
  if (!this.planEstado) return false;
  const canjesHoy = this.planEstado.canjesHoy ?? 0;
  const limiteDiario = this.planEstado.plan?.limiteDiario ?? 1;
  const fechaUltimoCanje = this.planEstado.fechaUltimoCanje;
  if (!fechaUltimoCanje) return this.totalCartQuantity <= limiteDiario;
  const hoy = new Date().toLocaleDateString('en-CA');
  if (fechaUltimoCanje !== hoy) return this.totalCartQuantity <= limiteDiario;
  return canjesHoy + this.totalCartQuantity <= limiteDiario;
}

get tieneUsosDisponibles(): boolean {
  return this.usosRestantes >= this.totalCartQuantity && this.tieneUsoDiarioDisponible;
}
}
