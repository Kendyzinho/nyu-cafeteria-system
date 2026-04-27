import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  private apiUrl = 'http://localhost:3000/api/promotions';

  constructor(private http: HttpClient) {}

  getPromociones(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getPromocion(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  crearPromocion(promo: any): Observable<any> {
    return this.http.post(this.apiUrl, promo);
  }

  actualizarPromocion(id: number, promo: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, promo);
  }

  eliminarPromocion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}