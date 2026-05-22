import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user';
import { CartService, CartItem } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;
  initials: string = '';
  cartItems: CartItem[] = [];
  cartCount: number = 0;
  cartTotal: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Nos suscribimos al usuario actual para que el Navbar reaccione dinámicamente
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        // Obtenemos la primera letra del nombre y apellido para el Avatar
        this.initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
      } else {
        this.initials = '';
      }
    });

    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
      this.cartTotal = this.cartService.getTotalAmount();
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  updateCartItem(item: CartItem, change: number) {
    this.cartService.updateQuantity(item.product.id, item.quantity + change);
  }

  removeCartItem(item: CartItem) {
    this.cartService.removeItem(item.product.id);
  }
}