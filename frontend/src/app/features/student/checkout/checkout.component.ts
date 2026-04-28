import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  fechaRetiro: string = '';
  
  calculation: any = null;
  loadingCalculation = false;
  
  processingPayment = false;
  paymentError: string | null = null;
  
  highDemandWarning = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCart();
    if (this.cartItems.length > 0) {
      this.calculateTotal();
    }
  }

  get itemsForApi() {
    return this.cartItems.map(item => ({
      id: item.producto.id,
      cantidad: item.cantidad
    }));
  }

  calculateTotal() {
    this.loadingCalculation = true;
    this.orderService.calculateOrder(this.itemsForApi, this.fechaRetiro).subscribe({
      next: (res) => {
        this.calculation = res;
        this.loadingCalculation = false;
      },
      error: (err) => {
        console.error('Error calculating', err);
        this.loadingCalculation = false;
      }
    });
  }

  onTimeChange() {
    // Regla de negocio: Recepción de demanda proyectada desde Biblioteca
    // Simulamos que de 13:00 a 14:30 hay alta demanda
    if (!this.fechaRetiro) {
      this.highDemandWarning = false;
    } else {
      const time = new Date(this.fechaRetiro);
      const hours = time.getHours();
      const mins = time.getMinutes();
      const timeValue = hours + (mins / 60);
      
      if (timeValue >= 13 && timeValue <= 14.5) {
        this.highDemandWarning = true;
      } else {
        this.highDemandWarning = false;
      }
    }
    
    // Recalculate if needed
    if (this.cartItems.length > 0) {
      this.calculateTotal();
    }
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
    this.cartItems = this.cartService.getCart();
    if (this.cartItems.length > 0) {
      this.calculateTotal();
    } else {
      this.calculation = null;
    }
  }

  checkout() {
    if (this.cartItems.length === 0) return;
    
    this.processingPayment = true;
    this.paymentError = null;
    
    this.orderService.checkout(this.itemsForApi, this.fechaRetiro).subscribe({
      next: (res) => {
        this.processingPayment = false;
        this.cartService.clearCart();
        // Redirect to success or history
        this.router.navigate(['/student/history'], { queryParams: { success: 'true' } });
      },
      error: (err) => {
        this.processingPayment = false;
        this.paymentError = err.error?.message || 'Error al procesar el pago con Tesorería';
      }
    });
  }
}
