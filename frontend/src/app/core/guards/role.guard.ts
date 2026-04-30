import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard  {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.authService.getCurrentUser();
    
    // Verificamos si existe el usuario y si su rol es explícitamente Administrador
    if (user && user.role === 'Administrador') {
      return true;
    }
    
    // Si es un Cliente normal, lo devolvemos al inicio para proteger la ruta
    this.router.navigate(['/home']);
    return false;
  }
}