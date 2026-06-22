import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  // CAMBIO: Conectamos con el environment y apuntamos a la ruta /promotions de tu Swagger
  private apiUrl = `${environment.apiBackendUrl}/promotions`;

  constructor(private http: HttpClient) {}

  // Obtener todas las promociones (/api/promotions)
  getPromociones(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Crear una nueva promoción (/api/promotions)
  createPromocion(promo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, promo);
  }

  // Actualizar una promoción (/api/promotions/{id})
  aplicarPromocion(id: number, promoData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, promoData);
  }

  // Eliminar una promoción (/api/promotions/{id})
  deletePromocion(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}