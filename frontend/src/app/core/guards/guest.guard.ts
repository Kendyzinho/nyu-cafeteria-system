import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.authService.isAuthenticated()) {
      return true; // Puede acceder al login si NO está autenticado
    }
    
    // Si ya está autenticado, lo redirigimos dependiendo de su rol
    const user = this.authService.getCurrentUser();
    if (user && user.role === 'Administrador') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/home']);
    }
    return false;
  }
}
