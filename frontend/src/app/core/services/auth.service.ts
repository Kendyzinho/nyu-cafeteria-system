import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../models/user';

// Extendemos la interfaz User INTERNAMENTE para simular la base de datos con contraseñas y planes.
// Esto evita que la contraseña se filtre a otros componentes por seguridad.
export interface MockUser extends User {
  password?: string;
  planType?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // 1. LA ÚNICA FUENTE DE VERDAD (Single Source of Truth)
  // Convertimos el arreglo en un BehaviorSubject para que sea reactivo y todos los servicios lo vean.
  private mockUsersDatabase = new BehaviorSubject<MockUser[]>([
    { 
      id: 1, 
      email: 'admin@nyu.edu', 
      password: 'admin', // Contraseña por defecto para probar el Staff
      firstName: 'Staff', 
      lastName: 'NYU', 
      role: 'Administrador', 
      isActive: true, 
      isResident: false 
    },
    { 
      id: 2, 
      email: 'alumno@nyu.edu', 
      password: '123', // Contraseña por defecto para probar el Cliente
      firstName: 'Alejandro', 
      lastName: 'Ruiz', 
      role: 'Cliente', 
      isActive: true, 
      isResident: true,
      planType: 'Plan Residente Premium'
    }
  ]);

  // Exponemos la lista maestra como un Observable público para que el UsersService (Admin) la consuma
  public users$ = this.mockUsersDatabase.asObservable();

  // Gestión del usuario logueado actualmente
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('current_user');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  /**
   * REGISTRO: Guarda al nuevo usuario y SU CONTRASEÑA en la lista maestra.
   */
  register(userData: any): Observable<any> {
    const isAdmin = userData.email ? userData.email.toLowerCase().includes('admin') : false;

    const newUser: MockUser = {
      id: Math.floor(Math.random() * 1000),
      email: userData.email,
      password: userData.password, // Guardamos la contraseña introducida
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: isAdmin ? 'Administrador' : 'Cliente',
      isActive: true,
      isResident: !isAdmin,
      planType: isAdmin ? undefined : 'Sin Plan Asignado'
    };

    // ACTUALIZACIÓN COHERENTE: Añadimos el nuevo usuario a la lista maestra reactiva
    const currentUsers = this.mockUsersDatabase.value;
    this.mockUsersDatabase.next([...currentUsers, newUser]);
    
    console.log('Usuario registrado con éxito en la BD Maestra:', newUser.email);
    
    return of({ success: true }).pipe(
      tap(() => console.log('Registro procesado.'))
    );
  }

  /**
   * LOGIN: Valida que exista el correo en la BD Maestra y que LA CONTRASEÑA COINCIDA.
   */
  login(email: string, password: string): Observable<any> {
    const users = this.mockUsersDatabase.value;
    const userFound = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!userFound) {
      return throwError(() => new Error('Este correo no está registrado en la Cafetería NYU.'));
    }

    if (userFound.password !== password) {
      return throwError(() => new Error('Contraseña incorrecta. Inténtalo de nuevo.'));
    }

    // Le quitamos el campo "password" al objeto antes de guardarlo en el LocalStorage
    const { password: _, ...safeUser } = userFound;

    const mockResponse = {
      access_token: safeUser.role === 'Administrador' ? 'token-admin-123' : 'token-estudiante-456',
      user: safeUser
    };

    return of(mockResponse).pipe(
      tap(response => {
        localStorage.setItem('jwt_token', response.access_token);
        localStorage.setItem('current_user', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user as User);
      })
    );
  }

  /**
   * GESTIÓN ADMIN: Actualiza el estado de un usuario de forma global
   */
  updateUserStatus(userId: number): void {
    const users = this.mockUsersDatabase.value;
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index].isActive = !users[index].isActive;
      // Emitimos la lista actualizada para que la tabla del Admin reaccione en vivo
      this.mockUsersDatabase.next([...users]);
    }
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('current_user');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}