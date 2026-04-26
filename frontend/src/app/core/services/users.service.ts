import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../models/user';

// Extendemos la interfaz User original para no romper el modelo base de la app,
// y le añadimos el planType que exige el diseño para la tabla del Administrador.
export interface UserAdminView extends User {
  planType?: string; 
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  // Mantenemos tu variable de entorno lista para cuando conectes con el backend real
  private readonly API_URL = 'http://localhost:3000/api/users'; 

  // 1. Base de datos en memoria (Mock estructurado cumpliendo estrictamente con la interfaz)
  private initialUsers: UserAdminView[] = [
    { id: 1, email: 'user1@gmail.com', firstName: 'Alexis', lastName: 'G.', role: 'Cliente', isActive: true, isResident: true, planType: 'Plan Basico' },
    { id: 2, email: 'user2@gmail.com', firstName: 'Martin', lastName: 'S.', role: 'Cliente', isActive: true, isResident: true, planType: 'Plan Deluxe' },
    { id: 3, email: 'user3@gmail.com', firstName: 'Álvaro', lastName: 'H.', role: 'Cliente', isActive: false, isResident: true, planType: 'Plan Premium' },
    { id: 4, email: 'user4@gmail.com', firstName: 'Cristofer', lastName: 'M.', role: 'Cliente', isActive: true, isResident: true, planType: 'Plan Deluxe' }
  ];

  // 2. Estado Global Reactivo (El "Cerebro" que evita que los cambios se borren)
  private usersSubject = new BehaviorSubject<UserAdminView[]>(this.initialUsers);
  public users$ = this.usersSubject.asObservable();

  // Mantenemos inyectado el HttpClient para tu futuro paso a producción
  constructor(private http: HttpClient) { }

  // Obtiene la lista completa de usuarios como un flujo de datos en tiempo real
  getAllUsers(): Observable<UserAdminView[]> {
    // Cuando el backend esté listo, cambiarás esta línea por:
    // return this.http.get<UserAdminView[]>(this.API_URL);
    return this.users$;
  }

  // Alterna el estado del usuario (Activo/Inactivo) y lo guarda en memoria
  toggleUserStatus(userId: number): void {
    const currentUsers = this.usersSubject.value;
    const userIndex = currentUsers.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      // Invertimos el estado
      currentUsers[userIndex].isActive = !currentUsers[userIndex].isActive;
      
      // Emitimos la lista actualizada a toda la app para que Angular actualice la tabla sola
      this.usersSubject.next([...currentUsers]);
      
      // Cuando el backend esté listo, descomentarás esta petición HTTP:
      // this.http.patch(`${this.API_URL}/${userId}/status`, { isActive: currentUsers[userIndex].isActive }).subscribe();
    }
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