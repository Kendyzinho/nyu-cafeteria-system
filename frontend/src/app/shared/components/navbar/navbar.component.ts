import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;
  initials: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Nos suscribimos al usuario actual para que el Navbar reaccione dinámicamente
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        // Obtenemos la primera letra del nombre y apellido para el Avatar
        this.initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
      } else {
        this.initials = '';
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}