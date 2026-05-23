import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StockProducto {
  id: number;
  menuItemId: number;
  nombre: string;
  categoria: string;
  cantidad: number;
  umbralMinimo: number;
  ultimaActualizacion: string;
}

export interface ActualizarStockPayload {
  cantidad?: number;
  umbralMinimo?: number;
}

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getProductos(): Observable<StockProducto[]> {
    return this.http.get<StockProducto[]>(`${this.apiUrl}/stock`);
  }

  actualizarStock(producto: StockProducto): Observable<void> {
    const body: ActualizarStockPayload = {
      cantidad: producto.cantidad,
      umbralMinimo: producto.umbralMinimo,
    };
    return this.http.put<void>(`${this.apiUrl}/stock/${producto.id}`, body);
  }
}