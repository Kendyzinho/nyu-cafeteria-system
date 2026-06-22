import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../../../core/models/product';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent {
  // Recibe el producto desde el componente padre
  @Input() item!: Product;

  // Emite el producto seleccionado al carrito
  @Output() add = new EventEmitter<Product>();

  onAddToCart() {
    // Cuando el usuario hace clic, disparamos el evento enviando el producto
    this.add.emit(this.item);
  }
}