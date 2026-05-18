import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuService } from '../../../core/services/menu.service';
import { CartService } from '../../../core/services/cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  @ViewChild('filtroCategoria') filtroSelect!: ElementRef;

  menuItems: any[] = [];

  constructor(
    private menuService: MenuService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.menuService.getAll().subscribe(items => {
      this.menuItems = items;
    });
  }

  handleAddToCart(itemRecibido: any) {
    this.cartService.addToCart(itemRecibido);
    
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'success',
      title: `Agregado: ${itemRecibido.nombre || itemRecibido.name}`,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      background: '#333',
      color: '#fff'
    });
  }

  resetFiltro() {
    this.filtroSelect.nativeElement.value = 'todos';
  }
}