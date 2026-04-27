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

  private apiUrl = 'http://localhost:3000/api';


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
  return this.http.post<any>(`${this.apiUrl}/auth/register`, {
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    password: userData.password
  });
}

  /**
   * LOGIN: Valida que exista el correo en la BD Maestra y que LA CONTRASEÑA COINCIDA.
   */
  login(email: string, password: string): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
    tap(response => {
      localStorage.setItem('jwt_token', response.access_token);
      localStorage.setItem('current_user', JSON.stringify(response.user));
      this.currentUserSubject.next(response.user as User);
    })
  );
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