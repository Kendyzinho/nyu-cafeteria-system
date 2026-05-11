import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuService } from '../../../core/services/menu.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  @ViewChild('filtroCategoria') filtroSelect!: ElementRef;

  menuItems: any[] = [];
  filteredMenuItems: any[] = [];

  constructor(
    private menuService: MenuService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.menuService.getAll().subscribe(items => {
      this.menuItems = items;
      this.filteredMenuItems = items;
    });
  }

  handleAddToCart(itemRecibido: any) {
    this.cartService.addItem(itemRecibido);
  }

  onFilterChange(event: any) {
    const category = event.target.value;
    if (category === 'todos') {
      this.filteredMenuItems = this.menuItems;
    } else {
      this.filteredMenuItems = this.menuItems.filter(item => item.category === category);
    }
  }

  resetFiltro() {
    this.filtroSelect.nativeElement.value = 'todos';
    this.filteredMenuItems = this.menuItems;
  }
}