import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface UserAdminView {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  isResident: boolean;
  planType?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly API_URL = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<UserAdminView[]> {
    return this.http.get<any[]>(this.API_URL).pipe(
      map(users => users.map(u => ({
        id: u.id,
        email: u.email,
        firstName: u.nombre,
        lastName: u.apellido,
        role: u.tipo,
        isActive: true,
        isResident: u.tipo === 'residente',
        planType: undefined
      })))
    );
  }

  toggleUserStatus(userId: number): void {
    // pendiente conectar al backend
  }
}