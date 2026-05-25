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
  initials: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        const parts = user.firstName.trim().split(' ');
        if (parts.length >= 2) {
          this.initials = `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
        } else {
          this.initials = user.firstName.substring(0, 2).toUpperCase();
        }
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
