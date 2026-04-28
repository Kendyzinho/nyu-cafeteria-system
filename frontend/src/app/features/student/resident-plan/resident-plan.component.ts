import { Component, OnInit } from '@angular/core';
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
  paymentSuccess = false;

  constructor(
    private planService: PlanService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Verificar si el estudiante actual tiene residencia activa en el JWT/perfil
    const user = this.authService.getUser();
    if (user && user.email === 'juan@nyu.edu') {
      this.residenciaActiva = true; // Hardcodeado por simplificación
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

    // Simulamos integración con tesorería
    const confirm = window.confirm(`¿Autorizas el cobro de $${plan.precio} por el plan ${plan.nombre} a través del Sistema de Tesorería?`);
    if (confirm) {
      this.paymentSuccess = true;
      setTimeout(() => this.paymentSuccess = false, 5000);
    }
  }
}
