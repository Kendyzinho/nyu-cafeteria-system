import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService, CartItem } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  totalAmount: number = 0;
  private cartSub!: Subscription;

  pickupTime: string = '';
  paymentMethod: string = 'Tarjeta';
  isProcessing: boolean = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartSub = this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.totalAmount = this.cartService.getTotalAmount();
    });
  }

  ngOnDestroy(): void {
    if (this.cartSub) this.cartSub.unsubscribe();
  }

  updateQuantity(item: CartItem, change: number) {
    this.cartService.updateQuantity(item.product.id, item.quantity + change);
  }

  removeItem(item: CartItem) {
    this.cartService.removeItem(item.product.id);
  }

  confirmOrder() {
    if (!this.pickupTime) {
      alert('Por favor selecciona una hora de retiro.');
      return;
    }
    
    if (this.cartItems.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    this.isProcessing = true;

    const user = this.authService.getCurrentUser();

    // Map payload to match backend DTO: IPostOrderRequest
    const payload = {
      usuarioId: user ? user.id : 1, 
      items: this.cartItems.map(i => ({
        productId: i.product.id,
        quantity: i.quantity,
        price: i.product.price
      }))
    };

    this.orderService.createOrder(payload).subscribe({
      next: () => {
        this.isProcessing = false;
        this.cartService.clearCart();
        alert(`¡Pedido confirmado! Retira a las ${this.pickupTime}`);
        this.router.navigate(['/history']);
      },
      error: (err: any) => {
        console.error('Error al procesar orden', err);
        alert('Hubo un problema procesando tu pago u orden.');
        this.isProcessing = false;
      }
    });
  }
}
