import { Component, OnInit } from '@angular/core';
import { StockService } from '../../../core/services/stock.service';

@Component({
  selector: 'app-stock-admin',
  templateUrl: './stock-admin.component.html',
  styleUrls: ['./stock-admin.component.css']
})
export class StockAdminComponent implements OnInit {
  productos: any[] = [];

  constructor(private stockService: StockService) {}

  ngOnInit() {
    this.cargarStock();
  }

  cargarStock() {
    this.stockService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (err) => console.error('Error al cargar stock', err)
    });
  }

  actualizarStock(producto: any) {
    if (producto.stock < 0) {
      alert('El stock no puede ser negativo');
      producto.stock = 0;
      return;
    }

    this.stockService.actualizarStock(producto).subscribe({
      next: () => {
        if (producto.stock === 0) {
          alert(`${producto.nombre} quedó bloqueado por falta de stock`);
        } else {
          alert(`Stock de ${producto.nombre} actualizado correctamente`);
        }
      },
      error: (err) => {
        alert('Error al actualizar el stock');
        console.error(err);
      }
    });
  }
}