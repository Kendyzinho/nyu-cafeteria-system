import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

// Extendemos un poco la interfaz localmente por si el backend nos devuelve el plan
export interface UserAdminView extends User {
  planType?: string; // Ej: 'Plan Basico', 'Plan Deluxe'
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  // Ajusta la ruta a tu controlador de usuarios en NestJS
  private readonly API_URL = 'http://localhost:3000/api/users'; 

  constructor(private http: HttpClient) { }

  // Obtiene la lista completa de usuarios (Solo administradores deberían poder hacer esto)
  getAllUsers(): Observable<UserAdminView[]> {
    return this.http.get<UserAdminView[]>(this.API_URL);
  }

  // Si más adelante necesitas activar/desactivar un usuario:
  toggleUserStatus(userId: number, isActive: boolean): Observable<UserAdminView> {
    return this.http.patch<UserAdminView>(`${this.API_URL}/${userId}/status`, { isActive });
  }
}