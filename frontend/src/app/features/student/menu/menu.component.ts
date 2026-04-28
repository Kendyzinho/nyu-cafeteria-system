import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartService, CartItem } from '../../../core/services/cart.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {
  menuItems: any[] = [];
  cartItems: CartItem[] = [];
  showCart = false;
  private cartSub!: Subscription;

  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchMenu();
    this.cartSub = this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
    });
  }

  ngOnDestroy() {
    this.cartSub.unsubscribe();
  }

  get totalItems(): number {
    return this.cartItems.reduce((sum, i) => sum + i.cantidad, 0);
  }

  get totalPrice(): number {
    return this.cartItems.reduce((sum, i) => sum + i.producto.precio * i.cantidad, 0);
  }

  fetchMenu() {
    this.http.get<any[]>('http://localhost:3000/api/menu').subscribe({
      next: (data) => {
        this.menuItems = data.map(item => ({
          id: item.id,
          nombre: item.nombre,
          precio: Number(item.precio),
          categoria: item.categoria,
          name: item.nombre,
          category: item.categoria,
          description: item.descripcion,
          price: Number(item.precio),
          image: this.getImageForCategory(item.categoria),
          isAvailable: item.disponible && item.stockActual > 0
        }));
      },
      error: (error) => {
        console.error('Error fetching menu:', error);
      }
    });
  }

  getImageForCategory(categoria: string): string {
    if (categoria.toLowerCase().includes('bebida')) {
      return 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=300&q=80';
    } else if (categoria.toLowerCase().includes('saludable')) {
      return 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=300&q=80';
    }
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80';
  }

  addToCart(item: any) {
    if (item.isAvailable) {
      this.cartService.addToCart({ id: item.id, nombre: item.nombre, precio: item.precio, categoria: item.categoria }, 1);
    }
  }

  removeFromCart(productoId: number) {
    this.cartService.removeFromCart(productoId);
  }

  goToCheckout() {
    this.showCart = false;
    this.router.navigate(['/checkout']);
  }
}
