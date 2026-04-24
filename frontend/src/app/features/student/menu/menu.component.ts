import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../../core/services/menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  menuItems: any[] = [];

  constructor(private menuService: MenuService) {}

  ngOnInit() {
    this.menuService.getAll().subscribe(items => {
      this.menuItems = items.map(item => ({
        id: item.id,
        name: item.nombre,
        category: item.categoria,
        description: item.descripcion,
        price: item.precio,
        studentPrice: item.precioEstudiante,
        image: item.image,
        isAvailable: item.disponible
      }));
    });
  }

  addToCart(item: any) {
    if (item.isAvailable) {
      console.log('Agregado al carrito:', item.name);
      alert(`${item.name} agregado a tu pedido.`);
    }
  }
}