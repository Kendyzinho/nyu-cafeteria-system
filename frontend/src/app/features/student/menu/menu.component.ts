import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../../core/services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  menuItems: any[] = [];

  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchMenu();
  }

  fetchMenu() {
    this.http.get<any[]>('http://localhost:3000/api/menu').subscribe({
      next: (data) => {
        // Mapear los datos del backend a la estructura que espera el HTML
        this.menuItems = data.map(item => ({
          id: item.id,
          nombre: item.nombre, // guardamos el original para el carrito
          precio: Number(item.precio), // guardamos el original para el carrito
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
    // Retornar una imagen de prueba basada en la categoría
    if (categoria.toLowerCase().includes('bebida')) {
      return 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=300&q=80';
    } else if (categoria.toLowerCase().includes('saludable')) {
      return 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=300&q=80';
    }
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80';
  }

  addToCart(item: any) {
    if(item.isAvailable) {
      this.cartService.addToCart({ id: item.id, nombre: item.nombre, precio: item.precio, categoria: item.categoria }, 1);
    }
  }

  goToCheckout() {
    this.router.navigate(['/student/checkout']);
  }
}