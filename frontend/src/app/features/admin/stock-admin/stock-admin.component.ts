import { Component } from '@angular/core';
import { StockService } from '../../../core/services/stock.service';

@Component({
  selector: 'app-stock-admin',
  templateUrl: './stock-admin.component.html',
  styleUrls: ['./stock-admin.component.css']
})
export class StockAdminComponent {
  productos: any[] = [];

  constructor(private stockService: StockService) {
    this.productos = this.stockService.getProductos();
  }

  actualizarStock(producto: any) {
    if (producto.stock < 0) {
      alert('El stock no puede ser negativo');
      producto.stock = 0;
      return;
    }

    this.stockService.actualizarStock(producto);

    if (producto.stock === 0) {
      alert(`${producto.nombre} quedó bloqueado por falta de stock`);
    } else {
      alert(`Stock de ${producto.nombre} actualizado correctamente`);
    }
  }
}