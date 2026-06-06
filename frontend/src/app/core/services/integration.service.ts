import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IntegrationService {

  constructor(private http: HttpClient) {}

  validarEstudianteActivo(estudiante: any): Observable<boolean> {
    // Intenta conectar al Sistema de Matrícula (Equipo 1)
    return this.http.post<any>(`${environment.apiMatriculaUrl}/validar`, { email: estudiante.email }).pipe(
      map(res => res.isValid),
      catchError(err => {
        console.warn('API Eq1 inalcanzable. Usando fallback local para Estudiante Activo.');
        return of(estudiante.isActive === true); // Fallback usando mock_usuario.activo
      })
    );
  }

  validarResidenciaActiva(estudiante: any): Observable<boolean> {
    // Intenta conectar al Sistema de Alojamiento (Equipo 2)
    return this.http.post<any>(`${environment.apiResidenciaUrl}/verificar`, { email: estudiante.email }).pipe(
      map(res => res.hasActiveResidency),
      catchError(err => {
        console.warn('API Eq2 inalcanzable. Usando fallback local para Residencia.');
        return of(estudiante.residenciaActiva === true || estudiante.isResident === true); // Fallback mock
      })
    );
  }
validarPagoAprobado(payload: any): Observable<{ aprobado: boolean; transactionId?: number }> {
  return this.http.post<any>(`${environment.apiPagosUrl}/procesar`, payload).pipe(
    map(res => ({
      aprobado: res.status === 'APPROVED',
      transactionId: res.transactionId,
    })),
    catchError(() => {
      console.warn('API Pagos inalcanzable. Usando fallback local.');
      return of({ aprobado: true, transactionId: undefined });
    })
  );
}}