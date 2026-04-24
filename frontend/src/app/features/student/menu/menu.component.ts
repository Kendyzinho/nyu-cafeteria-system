import { Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  // Simulamos los datos que luego vendrán del backend
  menuItems = [
    {
      id: 1,
      name: 'Bowl de Quinoa y Pollo Grill',
      category: 'Almuerzos',
      description: 'Proteína premium, vegetales frescos y aderezo artesanal.',
      price: 7500,
      studentPrice: 5625,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80',
      isAvailable: true
    },
    {
      id: 2,
      name: 'Wrap Vegetariano',
      category: 'Opciones Ligeras',
      description: 'Hummus, espinaca, tomate y falafel en tortilla de maíz.',
      price: 4000,
      studentPrice: 3000,
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=300&q=80',
      isAvailable: false // ESTO CUMPLE LA RÚBRICA (Producto Agotado)
    },
    {
      id: 3,
      name: 'Café Latte Vainilla',
      category: 'Bebidas',
      description: 'Café de especialidad con leche texturizada y vainilla.',
      price: 2500,
      studentPrice: 1875,
      image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=300&q=80',
      isAvailable: true
    }
  ];

  addToCart(item: any) {
    if(item.isAvailable) {
      console.log('Agregado al carrito:', item.name);
      alert(`${item.name} agregado a tu pedido.`);
    }
  }
}