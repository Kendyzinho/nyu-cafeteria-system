import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { CartItem } from '../../../core/models/cart-item';
import { formatearSlot, getSlotsDisponiblesHoy } from '../../../core/constants/cafeteria-horario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  total: number = 0;

  slotsDisponibles: Date[] = [];
  horarioSeleccionadoIso: string | null = null;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.items$.subscribe(items => {
      this.cartItems = items;
      this.total = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    });
    this.recargarSlots();
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

  removerItem(itemId: number) {
    this.cartService.removeItem(itemId);
  }

  aumentarCantidad(itemId: number) {
    this.cartService.updateQuantity(itemId, 1);
  }

  disminuirCantidad(itemId: number) {
    this.cartService.updateQuantity(itemId, -1);
  }

  confirmarPedido() {
    if (this.cartItems.length === 0) {
      Swal.fire({
        title: 'Atención',
        text: 'Tu carrito está vacío.',
        icon: 'warning',
        confirmButtonColor: '#4E342E'
      });
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      Swal.fire({
        title: 'Error',
        text: 'Debes iniciar sesión para realizar un pedido.',
        icon: 'error',
        confirmButtonColor: '#4E342E'
      });
      return;
    }

    if (!this.horarioSeleccionadoIso) {
      Swal.fire({
        title: 'Atención',
        text: 'Selecciona un horario de retiro para tu pedido.',
        icon: 'warning',
        confirmButtonColor: '#4E342E'
      });
      return;
    }

    const horarioRetiro = new Date(this.horarioSeleccionadoIso);

    this.cartService.checkoutOrder(currentUser.id, horarioRetiro).subscribe({
      next: () => {
        Swal.fire({
          title: '¡Éxito!',
          text: `Pedido realizado. Pasa a retirar a las ${this.formatearSlot(horarioRetiro)}.`,
          icon: 'success',
          confirmButtonColor: '#4E342E'
        }).then(() => {
          this.cartService.clearCart();
          this.router.navigate(['/home']);
        });
      },
      error: (err) => {
        console.error('Error al crear pedido', err);
        let errorMsg = 'Hubo un error al procesar tu pedido. Verifica la consola para más detalles.';
        if (err.error && err.error.message) {
          errorMsg = err.error.message;
        }
        this.recargarSlots();
        Swal.fire({
          title: 'Error',
          text: errorMsg,
          icon: 'error',
          confirmButtonColor: '#4E342E'
        });
      }
    });
  }
}
