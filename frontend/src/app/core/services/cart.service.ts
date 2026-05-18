import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/cart-item';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  public items$: Observable<CartItem[]> = this.itemsSubject.asObservable();
  private apiUrl = 'http://localhost:3000/api/orders';

  constructor(private http: HttpClient) {
    // Cargar carrito desde localStorage si existe
    const savedCart = localStorage.getItem('cart_items');
    if (savedCart) {
      this.itemsSubject.next(JSON.parse(savedCart));
    }
  }

  private saveCart(items: CartItem[]) {
    this.itemsSubject.next(items);
    localStorage.setItem('cart_items', JSON.stringify(items));
  }

  addToCart(item: any) {
    const currentItems = this.itemsSubject.getValue();
    const existingItem = currentItems.find(i => i.id === item.id);
    
    if (existingItem) {
      existingItem.cantidad += 1;
      this.saveCart([...currentItems]);
    } else {
      const newItem: CartItem = {
        id: item.id,
        nombre: item.nombre || item.name, 
        precio: item.precio || item.studentPrice, 
        cantidad: 1
      };
      this.saveCart([...currentItems, newItem]);
    }
  }

  removeItem(itemId: number) {
    const currentItems = this.itemsSubject.getValue();
    const filteredItems = currentItems.filter(i => i.id !== itemId);
    this.saveCart(filteredItems);
  }

  updateQuantity(itemId: number, delta: number) {
    const currentItems = this.itemsSubject.getValue();
    const existingItem = currentItems.find(i => i.id === itemId);
    
    if (existingItem) {
      existingItem.cantidad += delta;
      if (existingItem.cantidad <= 0) {
        this.removeItem(itemId);
      } else {
        this.saveCart([...currentItems]);
      }
    }
  }

  getCartCount(): Observable<number> {
    return new Observable<number>(observer => {
      this.items$.subscribe(items => {
        const count = items.reduce((acc, item) => acc + item.cantidad, 0);
        observer.next(count);
      });
    });
  }

  getItems(): CartItem[] {
    return this.itemsSubject.getValue();
  }

  clearCart() {
    this.saveCart([]);
  }

  checkoutOrder(usuarioId: number, horarioRetiro: Date) {
    const items = this.getItems();
    const payload = {
      usuarioId,
      items,
      horarioRetiro: horarioRetiro.toISOString(),
    };
    return this.http.post(this.apiUrl, payload);
  }
}
