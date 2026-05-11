import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/menu`);
  }

  create(product: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/menu`, product);
  }

  update(id: number, product: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/menu/${id}`, product);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/menu/${id}`);
  }
}