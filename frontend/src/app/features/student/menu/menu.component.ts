import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuService } from '../../../core/services/menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  @ViewChild('filtroCategoria') filtroSelect!: ElementRef;

  menuItems: any[] = [];

  constructor(private menuService: MenuService) {}

  ngOnInit() {
    this.menuService.getAll().subscribe(items => {
      this.menuItems = items;
    });
  }

  handleAddToCart(itemRecibido: any) {
    console.log('El componente hijo envió:', itemRecibido.name);
    alert(`Has agregado "${itemRecibido.name}" a tu pedido por $${itemRecibido.studentPrice}`);
  }

  resetFiltro() {
    this.filtroSelect.nativeElement.value = 'todos';
  }
}