import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuService } from '../../../core/services/menu.service';
import { CartService } from '../../../core/services/cart.service';
import { ToastService } from '../../../core/services/toast.service';

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
    private cartService: CartService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.menuService.getAll().subscribe(items => {
      this.menuItems = items;
      this.filteredMenuItems = items;
    });
  }

  handleAddToCart(itemRecibido: any) {
    this.cartService.addItem(itemRecibido);
    this.toastService.show(`${itemRecibido.name || itemRecibido.nombre} agregado al carrito`, 'success');
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