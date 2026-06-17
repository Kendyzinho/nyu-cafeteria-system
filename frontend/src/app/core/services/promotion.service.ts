import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  private apiUrl = 'https://nyu-cafeteria-api.onrender.com/api';

  constructor(private http: HttpClient) {}

  getPromociones(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createPromocion(promo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, promo);
  }

  aplicarPromocion(id: number, promoData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, promoData);
  }
  deletePromocion(id: number): Observable<any> {
  return this.http.delete<any>(`${this.apiUrl}/${id}`);
}
}