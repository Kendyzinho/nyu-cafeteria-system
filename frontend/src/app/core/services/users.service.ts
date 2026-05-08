import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_BASE_URL } from '../config/api.config';

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
  private readonly API_URL = `${API_BASE_URL}/users`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<UserAdminView[]> {
    return this.http.get<any[]>(this.API_URL).pipe(
      map(users => users.map(u => ({
        id: u.id,
        email: u.email,
        firstName: u.nombre,
        lastName: u.apellido,
        role: u.tipo,
        isActive: u.isActive ?? true,
        isResident: (u.tipo ?? '').toLowerCase() === 'residente',
        planType: undefined
      })))
    );
  }

  toggleUserStatus(userId: number, isActive: boolean): Observable<unknown> {
    return this.http.put(`${this.API_URL}/${userId}`, { isActive });
  }
}
