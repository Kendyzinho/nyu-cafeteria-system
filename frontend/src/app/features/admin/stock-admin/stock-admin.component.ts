import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../../core/services/menu.service';

@Component({
  selector: 'app-stock-admin',
  templateUrl: './stock-admin.component.html',
  styleUrls: ['./stock-admin.component.css']
})
export class StockAdminComponent implements OnInit {
  productos: any[] = [];

  constructor(private menuService: MenuService) {}

  ngOnInit() {
    this.cargarStock();
  }

  cargarStock() {
    this.menuService.getAll().subscribe({
      next: (items) => this.productos = items,
      error: (err) => console.error('Error fetching stock', err)
    });
  }

  actualizarStock(producto: any) {
    if (producto.stock < 0) {
      alert('El stock no puede ser negativo');
      producto.stock = 0;
      return;
    }

    // El backend espera el campo "stockActual" y el resto de los campos requeridos
    const payload = {
      nombre: producto.name,
      descripcion: producto.description,
      precio: producto.price,
      categoria: producto.category,
      stockActual: producto.stock,
      disponible: producto.stock > 0
    };

    this.menuService.update(producto.id, payload).subscribe({
      next: () => {
        if (producto.stock === 0) {
          alert(`"${producto.name}" quedó bloqueado automáticamente por falta de stock`);
        } else {
          alert(`Stock de "${producto.name}" actualizado a ${producto.stock}`);
        }
      },
      error: (err) => {
        console.error('Error actualizando stock', err);
        alert('Error al actualizar el stock.');
      }
    });
  }
}