import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // Obtenemos el rol que exige la ruta a la que intenta entrar
    const expectedRole = route.data['expectedRole'];
    const currentUser = this.authService.getCurrentUser();

    // Validamos si el usuario existe y si su rol coincide con el exigido
    if (!currentUser || currentUser.role !== expectedRole) {
      // Si un Estudiante intenta entrar al Admin, lo devolvemos a su Home
      // Si un Admin intenta entrar a la vista de Estudiante, lo devolvemos a su Panel
      if (currentUser?.role === 'Administrador') {
        this.router.navigate(['/admin/users']);
      } else {
        this.router.navigate(['/home']);
      }
      return false;
    }
    return true; // El rol es correcto, lo deja pasar
  }
}