import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user';

@Component({
  selector: 'app-navbar-admin',
  templateUrl: './navbar-admin.component.html',
  styleUrls: ['./navbar-admin.component.css']
})
export class NavbarAdminComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtenemos al admin actual para mostrar su nombre en la barra
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  // Función crítica para poder salir del panel
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}