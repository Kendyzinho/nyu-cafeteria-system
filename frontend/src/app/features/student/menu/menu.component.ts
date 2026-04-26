import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  // 3. RÚBRICA: @ViewChild() para manipular elementos de la vista directamente
  @ViewChild('filtroCategoria') filtroSelect!: ElementRef;

  // Tu lista de datos original intacta
  menuItems = [
    {
      id: 1, name: 'Bowl de Quinoa y Pollo Grill', category: 'Almuerzos', 
      description: 'Proteína premium, vegetales frescos y aderezo artesanal.', 
      price: 7500, studentPrice: 5625, 
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80', isAvailable: true
    },
    {
      id: 2, name: 'Wrap Vegetariano', category: 'Opciones Ligeras', 
      description: 'Hummus, espinaca, tomate y falafel en tortilla de maíz.', 
      price: 4000, studentPrice: 3000, 
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=300&q=80', isAvailable: false 
    },
    {
      id: 3, name: 'Café Latte Vainilla', category: 'Bebidas', 
      description: 'Café de especialidad con leche texturizada y vainilla.', 
      price: 2500, studentPrice: 1875, 
      image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=300&q=80', isAvailable: true
    }
  ];

  // Función que atrapa el evento emitido por el Hijo
  handleAddToCart(itemRecibido: any) {
    console.log('El componente hijo envió:', itemRecibido.name);
    alert(`Has agregado "${itemRecibido.name}" a tu pedido por $${itemRecibido.studentPrice}`);
  }

  resetFiltro() {
    // Uso práctico del ViewChild para resetear el select a su valor por defecto
    this.filtroSelect.nativeElement.value = 'todos';
  }
}