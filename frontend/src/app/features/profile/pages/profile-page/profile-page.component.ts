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
    // Escuchamos al observable para que si el nombre cambia, el perfil también
    this.authService.currentUser$.subscribe(userData => {
      this.user = userData;
      if (this.user) {
        this.initials = `${this.user.firstName.charAt(0)}${this.user.lastName.charAt(0)}`.toUpperCase();
      }
    });
  }

  // Simulación de una acción profesional
  onUpdatePhoto() {
    alert('Funcionalidad de carga de imagen vinculada al repositorio de SIB-NYU (Simulado)');
  }
}