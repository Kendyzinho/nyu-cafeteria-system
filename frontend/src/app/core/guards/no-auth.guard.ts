import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      // Si ya tiene sesión, averiguamos quién es para mandarlo a su lugar correcto
      const user = this.authService.getCurrentUser();
      if (user?.role === 'Administrador') {
        this.router.navigate(['/admin/users']);
      } else {
        this.router.navigate(['/home']);
      }
      return false; // Bloquea el acceso al Login/Registro
    }
    return true; // Si no tiene sesión, lo deja pasar al Login
  }
}
