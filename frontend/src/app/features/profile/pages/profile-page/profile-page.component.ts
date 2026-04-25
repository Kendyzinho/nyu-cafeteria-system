import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  user: User | null = null;
  initials: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Obtenemos el usuario de la sesión actual
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.initials = `${this.user.firstName.charAt(0)}${this.user.lastName.charAt(0)}`.toUpperCase();
    }
  }
}