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
    const isAdmin = (user?.role ?? '').toLowerCase() === 'administrador';

    if (user && isAdmin) {
      return true;
    }

    this.router.navigate([user ? '/home' : '/login']);
    return false;
  }
}
