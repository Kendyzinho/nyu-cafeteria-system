import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

// Mock data - in a real app, this would come from a service
interface Product {
  id: number;
  name: string;
  category: string;
}

@Component({
  selector: 'app-menu-day-form',
  templateUrl: './menu-day-form.component.html',
  styleUrls: ['./menu-day-form.component.css']
})
export class MenuDayFormComponent implements OnInit {
  menuForm: FormGroup;
  availableProducts: Product[] = [
    { id: 1, name: 'Ensalada César', category: 'Ensaladas' },
    { id: 2, name: 'Sopa de Tomate', category: 'Sopas' },
    { id: 3, name: 'Lasaña de Carne', category: 'Platos Principales' },
    { id: 4, name: 'Jugo de Naranja', category: 'Bebidas' },
    { id: 5, name: 'Tarta de Manzana', category: 'Postres' },
  ];
  filteredProducts: Product[] = [];
  searchTerm: string = '';

  constructor(private fb: FormBuilder) {
    this.menuForm = this.fb.group({
      date: ['', Validators.required],
      menuItems: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.filteredProducts = this.availableProducts;
  }

  get menuItems(): FormArray {
    return this.menuForm.get('menuItems') as FormArray;
  }

  addMenuItem(product: Product): void {
    const menuItem = this.fb.group({
      productId: [product.id],
      name: [product.name],
      category: [product.category]
    });
    this.menuItems.push(menuItem);
    this.searchTerm = '';
    this.filteredProducts = this.availableProducts;
  }

  removeMenuItem(index: number): void {
    this.menuItems.removeAt(index);
  }

  filterProducts(): void {
    this.filteredProducts = !this.searchTerm
      ? this.availableProducts
      : this.availableProducts.filter(p => p.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  onSubmit(): void {
    if (this.menuForm.valid) {
      console.log('Guardando menú:', this.menuForm.value);
      // Aquí llamarías a un servicio para guardar el menú
    }
  }
}