import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService, MockUser } from './auth.service'; // Importamos la fuente maestra

// Creamos un alias de MockUser (que ya trae planType) para que tu componente 
// UsersListComponent no se rompa y siga funcionando exactamente igual.
export type UserAdminView = MockUser;

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  // Mantenemos tu variable de entorno intacta para tu futuro pase a producción
  private readonly API_URL = 'http://localhost:3000/api/users'; 

  constructor(
    private http: HttpClient, 
    private authService: AuthService // Inyectamos el "cerebro" central de cuentas
  ) { }

  /**
   * 1. OBTENER USUARIOS: Ahora lee en vivo desde el AuthService.
   * Si alguien se registra, esta tabla se entera automáticamente.
   */
  getAllUsers(): Observable<UserAdminView[]> {
    // Cuando conectes tu backend real (NestJS), cambiarás esta línea por:
    // return this.http.get<UserAdminView[]>(this.API_URL);
    return this.authService.users$;
  }

  /**
   * 2. ACTUALIZAR ESTADO: Envía la orden al AuthService para que 
   * guarde la persistencia (Single Source of Truth).
   */
  toggleUserStatus(userId: number): void {
    // Le decimos al servicio maestro que actualice el estado globalmente
    this.authService.updateUserStatus(userId);
    
    // A futuro, cuando tengas base de datos real, también enviarás la petición HTTP aquí:
    // this.http.patch(`${this.API_URL}/${userId}/status`, {}).subscribe();
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