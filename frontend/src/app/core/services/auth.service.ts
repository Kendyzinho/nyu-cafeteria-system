import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('current_user');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  // MOCK DEL LOGIN
  login(email: string, password: string): Observable<any> {
    
    // DINAMISMO: Si el correo incluye la palabra "admin", le damos el rol de Administrador.
    const isAdmin = email.toLowerCase().includes('admin');

    const mockUser: User = {
      id: isAdmin ? 1 : 99,
      email: email,
      firstName: isAdmin ? 'Staff' : 'Alejandro',
      lastName: isAdmin ? 'Cafetería' : 'Ruiz',
      role: isAdmin ? 'Administrador' : 'Cliente',
      isActive: true,
      isResident: !isAdmin // El estudiante es residente, el admin no lo necesita
    };
    
    const mockResponse = {
      access_token: isAdmin ? 'token-admin-123' : 'token-estudiante-456',
      user: mockUser
    };

    return of(mockResponse).pipe(
      tap(response => {
        localStorage.setItem('jwt_token', response.access_token);
        localStorage.setItem('current_user', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      })
    );
  }

  // MOCK DEL REGISTRO (Para arreglar el error: Property 'register' does not exist)
  register(userData: any): Observable<any> {
    return of({ success: true }).pipe(
      tap(() => console.log('Registro simulado exitoso'))
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