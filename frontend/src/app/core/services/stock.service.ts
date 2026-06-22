import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface StockProducto {
  id: number;
  nombre: string;
  unidad_medida: string;
  categoria?: string;
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

  // CAMBIO: Vinculamos al environment y apuntamos a la ruta /stock del Swagger de forma limpia
  private apiUrl = `${environment.apiBackendUrl}/stock`;

  constructor(private http: HttpClient) {}

  // Obtener todo el inventario (/api/stock)
  getProductos(): Observable<StockProducto[]> {
    return this.http.get<StockProducto[]>(this.apiUrl);
  }

  // Actualizar un ítem de stock por ID (/api/stock/{id})
  actualizarStock(producto: StockProducto): Observable<void> {
    const body: ActualizarStockPayload = {
      cantidad: producto.cantidad,
      umbralMinimo: producto.umbralMinimo,
    };
    return this.http.put<void>(`${this.apiUrl}/${producto.id}`, body);
  }
}