import { Component, OnInit } from '@angular/core';
import { PlanService } from '../../../core/services/plan.service';
import { IntegrationService } from '../../../core/services/integration.service';
@Component({
  selector: 'app-plans-admin',
  templateUrl: './plans-admin.component.html',
  styleUrls: ['./plans-admin.component.css']
})
export class PlansAdminComponent implements OnInit {
  planes: any[] = [];

  constructor(
    private planService: PlanService,
    private integrationService: IntegrationService
  ) {}

  ngOnInit() {
    this.loadPlanes();
  }

  loadPlanes() {
    this.planService.getPlanes().subscribe({
      next: (data: any[]) => this.planes = data,
      error: (err: any) => console.error('Error fetching plans', err)
    });
  }

  activarPlan(plan: any) {
    this.integrationService.validarResidenciaActiva(plan).subscribe(residenciaValida => {
      if (!residenciaValida) {
        alert('No se puede activar el plan: residencia inactiva');
        return;
      }

      this.planService.activarPlan(plan.id, { ...plan, planActivo: true }).subscribe({
        next: () => {
          alert(`Plan activado para ${plan.estudiante || 'el usuario'}`);
          this.loadPlanes();
        },
        error: (err: any) => {
          console.error('Error al activar plan', err);
          alert('Error al activar el plan.');
        }
      });
    });
  }
}