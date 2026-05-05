import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();

    // 1. Inyectamos el token si existe
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // 2. Enviamos la petición y capturamos posibles errores globales
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Si el backend nos dice que el usuario no está autorizado (Token expirado o inválido)
        if (error.status === 401) {
          console.warn('Token expirado o acceso denegado. Cerrando sesión...');
          
          // Limpiamos los datos del usuario
          this.authService.logout();
          
          // Redirigimos al login
          this.router.navigate(['/login']);
          
          // Opcional: Aquí podrías usar una librería como SweetAlert2 para mostrar un popup
          alert('Tu sesión ha expirado por seguridad. Por favor, ingresa nuevamente.');
        }
        
        // Devolvemos el error para que el componente que hizo la petición también pueda manejarlo si quiere
        return throwError(() => error);
      })
    );
  }
}