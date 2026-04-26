import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent {
  // 1. RÚBRICA: @Input() permite recibir un objeto desde el componente Padre
  @Input() item: any; 
  
  // 2. RÚBRICA: @Output() permite enviar un evento (como un clic) hacia el Padre
  @Output() add = new EventEmitter<any>();

  onAddToCart() {
    // Cuando el usuario hace clic, disparamos el evento enviando el producto
    this.add.emit(this.item);
  }
}