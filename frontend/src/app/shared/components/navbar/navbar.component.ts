import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user: any = null;
  initials: string = '??';

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    if (this.user && this.user.nombre) {
      const parts = this.user.nombre.split(' ');
      if (parts.length > 1) {
        this.initials = (parts[0][0] + parts[1][0]).toUpperCase();
      } else {
        this.initials = parts[0].substring(0, 2).toUpperCase();
      }
    }
  }

  logout() {
    this.authService.logout();
  }
}
