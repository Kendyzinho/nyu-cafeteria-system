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

  createPlan(plan: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, plan);
  }

  activarPlan(id: number, planData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, planData);
  }
}