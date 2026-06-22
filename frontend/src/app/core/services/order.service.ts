import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = environment.apiBackendUrl;

  constructor(private http: HttpClient) { }

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/orders`);
  }

  getOrdersByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/orders/user/${userId}`);
  }

  // Agregado basándonos en tu Swagger: Obtener un pedido por ID específico
  getOrderById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/orders/${id}`);
  }

  createOrder(orderData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/orders`, orderData);
  }

  getDescuento(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/orders/discount/${userId}`);
  }

  // Agregado basándonos en tu Swagger: Actualizar un pedido
  updateOrder(id: number, orderData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/orders/${id}`, orderData);
  }

  // Agregado basándonos en tu Swagger: Eliminar/Cancelar un pedido
  deleteOrder(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/orders/${id}`);
  }
}