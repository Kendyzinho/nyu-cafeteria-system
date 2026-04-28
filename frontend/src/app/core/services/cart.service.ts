import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  producto: any;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>(this.items);

  cart$ = this.cartSubject.asObservable();

  constructor() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        this.items = JSON.parse(savedCart);
        this.cartSubject.next(this.items);
      } catch (e) {}
    }
  }

  addToCart(producto: any, cantidad: number) {
    const existing = this.items.find(i => i.producto.id === producto.id);
    if (existing) {
      existing.cantidad += cantidad;
    } else {
      this.items.push({ producto, cantidad });
    }
    this.saveCart();
  }

  updateQuantity(productoId: number, cantidad: number) {
    const existing = this.items.find(i => i.producto.id === productoId);
    if (existing) {
      existing.cantidad = cantidad;
      if (existing.cantidad <= 0) {
        this.removeFromCart(productoId);
      } else {
        this.saveCart();
      }
    }
  }

  removeFromCart(productoId: number) {
    this.items = this.items.filter(i => i.producto.id !== productoId);
    this.saveCart();
  }

  clearCart() {
    this.items = [];
    this.saveCart();
  }

  getCart() {
    return this.items;
  }

  private saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.items));
    this.cartSubject.next(this.items);
  }
}
