import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/api/orders';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private get userId(): number | undefined {
    return this.authService.getUser()?.id;
  }

  calculateOrder(items: {id: number, cantidad: number}[], fechaRetiro?: string): Observable<any> {
    const payload = {
      usuarioId: this.userId,
      items,
      fechaRetiro
    };
    return this.http.post(`${this.apiUrl}/calculate`, payload);
  }

  checkout(items: {id: number, cantidad: number}[], fechaRetiro?: string): Observable<any> {
    const payload = {
      usuarioId: this.userId,
      items,
      fechaRetiro
    };
    return this.http.post(`${this.apiUrl}/checkout`, payload);
  }

  getHistory(): Observable<any> {
    return this.http.get(`${this.apiUrl}/history/${this.userId}`);
  }
}
