import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private apiUrl = 'http://localhost:3000/api/meal-plans';

  constructor(private http: HttpClient) {}

  getPlanes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getPlan(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  crearPlan(plan: any): Observable<any> {
    return this.http.post(this.apiUrl, plan);
  }

  actualizarPlan(id: number, plan: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, plan);
  }

  eliminarPlan(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}