import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private productos = [
    { id: 1, nombre: 'Almuerzo vegetariano', categoria: 'Almuerzo', stock: 10 },
    { id: 2, nombre: 'Sandwich de pollo', categoria: 'Snack', stock: 5 },
    { id: 3, nombre: 'Jugo natural', categoria: 'Bebida', stock: 0 }
  ];

  getProductos() {
    return this.productos;
  }

  actualizarStock(producto: any) {
    const index = this.productos.findIndex(p => p.id === producto.id);

    if (index !== -1) {
      this.productos[index].stock = producto.stock;
    }

    return this.productos[index];
  }
}