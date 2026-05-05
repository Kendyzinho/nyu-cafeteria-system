import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ResidentGuard  {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.authService.getCurrentUser();
    if (user && user.isResident) {
      return true;
    }
    // Si no es residente, lo mandamos al home
    this.router.navigate(['/home']);
    return false;
  }
}
