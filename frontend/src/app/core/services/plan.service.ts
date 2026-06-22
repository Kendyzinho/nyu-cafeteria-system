import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  // Ahora usamos el environment de forma limpia
  private planesUrl = `${environment.apiBackendUrl}/meal-plans`;
  private subscriptionUrl = `${environment.apiBackendUrl}/subscriptions`;

  constructor(private http: HttpClient) {}

  // Obtener todos los planes (/api/meal-plans)
  getPlanes(): Observable<any[]> {
    return this.http.get<any[]>(this.planesUrl);
  }

  // HU17 — Suscribir residente a un plan mensual (/api/subscriptions)
  suscribir(userId: number, planId: number, ordenPagoId?: number): Observable<any> {
    return this.http.post<any>(this.subscriptionUrl, { userId, planId, ordenPagoId });
  }

  // Actualizar un plan (/api/meal-plans/{id})
  activarPlan(id: number, planData: any): Observable<any> {
    return this.http.put<any>(`${this.planesUrl}/${id}`, planData);
  }

  // HU18 — Ver estado del plan activo (/api/subscriptions/user/{userId}/status)
  getEstadoPlan(userId: number): Observable<any> {
    return this.http.get<any>(`${this.subscriptionUrl}/user/${userId}/status`);
  }

  // Canjear una comida del plan activo (/api/subscriptions/user/{userId}/redeem)
  redimirComida(userId: number): Observable<any> {
    return this.http.post<any>(`${this.subscriptionUrl}/user/${userId}/redeem`, {});
  }
}