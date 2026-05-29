import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private apiUrl = 'http://localhost:3000/api/meal-plans';
  private subscriptionUrl = 'http://localhost:3000/api/subscriptions'; // ← nuevo

  constructor(private http: HttpClient) {}

  getPlanes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // HU17 — Suscribir residente a un plan mensual
suscribir(userId: number, planId: number): Observable<any> {
  return this.http.post<any>(this.subscriptionUrl, { userId, planId });
  // el userId lo lee el backend desde el token automáticamente
}
  activarPlan(id: number, planData: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/${id}`, planData);
}

  // HU18 — Ver estado del plan activo
  getEstadoPlan(userId: number): Observable<any> {
    return this.http.get<any>(`${this.subscriptionUrl}/user/${userId}/status`);
  }
  redimirComida(userId: number): Observable<any> {
  return this.http.post<any>(`${this.subscriptionUrl}/user/${userId}/redeem`, {});
  }
}