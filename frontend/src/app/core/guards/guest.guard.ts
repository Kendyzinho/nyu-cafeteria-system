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
      return true;
    }

    const user = this.authService.getCurrentUser();
    const isAdmin = (user?.role ?? '').toLowerCase() === 'administrador';

    this.router.navigate([isAdmin ? '/admin/users' : '/home']);
    return false;
  }
}
