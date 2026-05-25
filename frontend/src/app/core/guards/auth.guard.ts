import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  canActivateChild(): Observable<boolean> | boolean {
    return this.canActivate();
  }

  canActivate(): Observable<boolean> | boolean {
    if (this.authService.isAuthenticated()) {
      const user = this.authService.getCurrentUser();
      
      if (!user) {
        this.router.navigate(['/login']);
        return false;
      }

      // Consulta dinámica al backend para verificar estado y permisos vigentes
      return this.authService.checkUserStatus(user.id).pipe(
        map(dbUser => {
          if (!dbUser || !dbUser.activo) {
            this.authService.logout();
            this.router.navigate(['/login']);
            return false;
          }
          
          // Sincronizar estado local si el administrador le cambió roles o residencia en caliente
          const updatedUser = {
            ...user,
            role: dbUser.tipo,
            isActive: !!dbUser.activo,
            isResident: !!dbUser.es_residente,
            firstName: dbUser.nombre
          };
          this.authService.updateCurrentUser(updatedUser);
          
          return true;
        }),
        catchError(() => {
          // Si el servidor rechaza (ej. token revocado/inválido o usuario borrado)
          this.authService.logout();
          this.router.navigate(['/login']);
          return of(false);
        })
      );
    }
    
    // Si no está logueado, lo pateamos al login
    this.router.navigate(['/login']);
    return false;
  }
}