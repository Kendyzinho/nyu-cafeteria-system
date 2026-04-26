import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface UserAdminView {
  email: string;
  firstName: string;
  planType: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor() { }

  // Simulamos la respuesta de la base de datos basándonos ESTRICTAMENTE en el prototipo
  getAllUsers(): Observable<UserAdminView[]> {
    const mockUsers: UserAdminView[] = [
      { email: 'user1@gmail.com', firstName: 'Alexis', planType: 'Plan Basico', isActive: true },
      { email: 'user2@gmail.com', firstName: 'Martin', planType: 'Plan Deluxe', isActive: true },
      { email: 'user3@gmail.com', firstName: 'Álvaro', planType: 'Plan Premium', isActive: false },
      { email: 'user4@gmail.com', firstName: 'Cristofer', planType: 'Plan Deluxe', isActive: true }
    ];

    // Agregamos un pequeño retraso de medio segundo para simular la red real
    return of(mockUsers).pipe(delay(500));
  }
}

/*
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
  */