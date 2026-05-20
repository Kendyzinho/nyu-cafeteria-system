import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // <-- Revisa que esté esta importación
import { Observable } from 'rxjs'; // <-- Revisa que esté esta importación

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  
  // URL de tu API de NestJS (ajústala a tu ruta real, por ejemplo /api/subscriptions o /api/meal-plans)
  private apiUrl = 'http://localhost:3000/api/subscriptions'; 

  constructor(private http: HttpClient) { } // <-- El constructor DEBE tener esto instalado

  // 1. MODIFICA ESTE MÉTODO EXACTAMENTE ASÍ:
  getPlanes(): Observable<any> {
    // Al poner "return this.http.get", se transforma en un Observable y el error desaparece
    return this.http.get<any>(this.apiUrl);
  }

  // Tu otro método que agregamos hace poco:
  activarPlan(plan: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, plan);
  }
}