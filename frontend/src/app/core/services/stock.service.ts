import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = 'http://localhost:3000/api/menu';

  constructor(private http: HttpClient) {}

  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(items => items.map(item => ({
        id: item.id,
        nombre: item.nombre,
        categoria: item.categoria,
        stock: item.stockActual
      })))
    );
  }

  actualizarStock(producto: any): Observable<any> {
    // Solo enviamos el campo stockActual para que se actualice en la base de datos
    return this.http.put(`${this.apiUrl}/${producto.id}`, {
      stockActual: producto.stock
    });
  }
}