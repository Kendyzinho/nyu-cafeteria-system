import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  product: any;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();

  constructor() {
    const savedCart = localStorage.getItem('nyu_cart');
    if (savedCart) {
      try {
        this.cartItems.next(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error parsing cart from local storage', e);
      }
    }
  }

  private saveCart(items: CartItem[]) {
    localStorage.setItem('nyu_cart', JSON.stringify(items));
    this.cartItems.next(items);
  }

  addItem(product: any) {
    if (product.stock_actual <= 0) return; // Prevent adding out of stock
    
    const items = this.cartItems.getValue();
    const existing = items.find(item => item.product.id === product.id);
    
    if (existing) {
      if (existing.quantity < product.stock_actual) {
        existing.quantity++;
      }
    } else {
      items.push({ product, quantity: 1 });
    }
    this.saveCart([...items]);
  }

  removeItem(productId: number) {
    const items = this.cartItems.getValue().filter(item => item.product.id !== productId);
    this.saveCart(items);
  }

  updateQuantity(productId: number, quantity: number) {
    const items = this.cartItems.getValue();
    const existing = items.find(item => item.product.id === productId);
    if (existing) {
      if (quantity > existing.product.stock_actual) {
        existing.quantity = existing.product.stock_actual;
      } else if (quantity <= 0) {
        this.removeItem(productId);
        return;
      } else {
        existing.quantity = quantity;
      }
      this.saveCart([...items]);
    }
  }

  clearCart() {
    this.saveCart([]);
  }

  getTotalAmount(): number {
    return this.cartItems.getValue().reduce((total, item) => total + (item.product.precio_estudiante || item.product.precio || 0) * item.quantity, 0);
  }
}
