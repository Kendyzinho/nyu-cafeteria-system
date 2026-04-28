import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlanService } from '../../../core/services/plan.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-resident-plan',
  templateUrl: './resident-plan.component.html',
  styleUrls: ['./resident-plan.component.css']
})
export class ResidentPlanComponent implements OnInit {
  plans: any[] = [];
  loading = true;
  residenciaActiva = false;
  matriculaActiva = false;
  paymentSuccess = false;

  constructor(
    private planService: PlanService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      // Obtener datos frescos del usuario desde el backend
      this.http.get<any>(`http://localhost:3000/api/users/${user.id}`).subscribe({
        next: (freshUser) => {
          this.residenciaActiva = !!freshUser.residenciaActiva;
          this.matriculaActiva = !!freshUser.matriculaActiva;
          // Actualizar localStorage con datos frescos
          const updatedUser = { ...user, residenciaActiva: freshUser.residenciaActiva, matriculaActiva: freshUser.matriculaActiva };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        },
        error: () => {
          // Fallback a datos de localStorage
          this.residenciaActiva = !!user.residenciaActiva;
          this.matriculaActiva = !!user.matriculaActiva;
        }
      });
    }
    this.loadPlans();
  }

  loadPlans() {
    this.loading = true;
    this.planService.getPlanes().subscribe({
      next: (res: any[]) => {
        // Regla: Plan residencial aplica solo a estudiantes con residencia activa.
        this.plans = res.filter((p: any) => p.activo);
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  buyPlan(plan: any) {
    if (plan.tipo === 'residente' && !this.residenciaActiva) {
      alert('Error de Integración (Sistema de Alojamiento): No tienes una residencia activa registrada para contratar este plan.');
      return;
    }

    if (plan.tipo === 'matriculado' && !this.matriculaActiva) {
      alert('Error de Integración (Sistema de Matrícula): No tienes una matrícula activa registrada para contratar este plan.');
      return;
    }

    // Simulamos integración con tesorería
    const confirm = window.confirm(`¿Autorizas el cobro de $${plan.precio} por el plan ${plan.nombre} a través del Sistema de Tesorería?`);
    if (confirm) {
      this.paymentSuccess = true;
      setTimeout(() => this.paymentSuccess = false, 5000);
    }
  }
}

