import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { MenuService } from '../../../core/services/menu.service';
import { User } from '../../../core/models/user';
import { Product } from '../../../core/models/product';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser: User | null = null;
  recommendedProduct: Product | null = null;

  constructor(
    private authService: AuthService,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.menuService.getAll().subscribe({
      next: (products: Product[]) => {
        if (products && products.length > 0) {
          // Select the first available product as recommended
          this.recommendedProduct = products.find(p => p.stock_actual > 0) || products[0];
        }
      },
      error: (err) => console.error('Error fetching menu for home', err)
    });
  }
}