import { Component } from '@angular/core';
import { PlanService } from '../../../core/services/plan.service';
import { IntegrationService } from '../../../core/services/integration.service';
@Component({
  selector: 'app-plans-admin',
  templateUrl: './plans-admin.component.html',
  styleUrls: ['./plans-admin.component.css']
})
export class PlansAdminComponent {
  planes: any[] = [];

  constructor(
  private planService: PlanService,
  private integrationService: IntegrationService
) {
 this.planService.getPlanes().subscribe({
  next: (response: any) => {
    // Si tu backend NestJS envuelve los resultados en un objeto con la propiedad 'data', usaría response.data.
    // Si manda el arreglo plano desde la DB, guardará la respuesta directa.
    this.planes = response.data ? response.data : response;
  },
  error: (err: any) => {
    console.error('Error al cargar los planes en la tabla de administración:', err);
  }
});
}

  activarPlan(plan: any) {
  const residenciaValida = this.integrationService.validarResidenciaActiva(plan);

  if (!residenciaValida) {
    alert('No se puede activar el plan: residencia inactiva');
    return;
  }

  this.planService.activarPlan(plan);
  alert(`Plan activado para ${plan.estudiante}`);
  }
}