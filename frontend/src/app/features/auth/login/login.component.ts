import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (response) => {
          this.isLoading = false;
          
          // RÚBRICA: Enrutamiento basado en roles
          if (response.user.role === 'Administrador') {
            this.router.navigate(['/admin/users']); // Manda al staff al panel de control
          } else {
            this.router.navigate(['/home']); // Manda al estudiante a la tienda
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Credenciales inválidas. Verifica tu correo y contraseña.';
        }
      });
    }
  }
}