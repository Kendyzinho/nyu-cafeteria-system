import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface UserAdminView {
  id: number;
  email: string;
  firstName: string;  // mock_usuario.nombre
  role: string;       // mock_usuario.tipo
  isActive: boolean;  // mock_usuario.activo
  isResident: boolean; // mock_usuario.es_residente
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly API_URL = 'https://nyu-cafeteria-api.onrender.com/api/users';

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<UserAdminView[]> {
    return this.http.get<any[]>(this.API_URL).pipe(
      map(users => users.map(u => ({
        id: u.id,
        email: u.email,
        firstName: u.nombre,
        role: u.tipo,
        isActive: !!u.activo,
        isResident: !!u.es_residente
      })))
    );
  }

  toggleUserStatus(userId: number, currentStatus: boolean): Observable<any> {
    return this.http.put(`${this.API_URL}/${userId}`, { activo: !currentStatus });
  }

  createUser(userData: any): Observable<any> {
    return this.http.post(this.API_URL, userData);
  }

  updateUser(id: number, userData: any): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, userData);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}