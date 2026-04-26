import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    // Mantenemos TODAS tus validaciones reactivas originales intactas
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  // Validador personalizado estricto para confirmar contraseña
  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      // Extraemos los datos del formulario excluyendo 'confirmPassword'
      // ya que este campo es solo para validación visual y no va a la base de datos
      const { confirmPassword, ...userData } = this.registerForm.value;
      
      // Enviamos la petición al servicio central (nuestra Single Source of Truth)
      this.authService.register(userData).subscribe({
        next: () => {
          this.isLoading = false;
          
          // Feedback visual para el usuario
          this.successMessage = '¡Registro exitoso! Preparando tu entorno...';
          
          // PASO 3: Redirección limpia y automática. 
          // Esperamos 2 segundos para que el usuario alcance a leer el mensaje de éxito.
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Hubo un error al procesar tu registro. Por favor, inténtalo de nuevo.';
          console.error('Error de registro:', error);
        }
      });
    }
  }
}