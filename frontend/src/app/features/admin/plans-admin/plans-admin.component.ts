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
  this.planes = this.planService.getPlanes();
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