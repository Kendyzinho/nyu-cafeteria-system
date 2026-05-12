import { Component, OnInit } from '@angular/core';
import { PlanService } from '../../../core/services/plan.service';
import { IntegrationService } from '../../../core/services/integration.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-plans-admin',
  templateUrl: './plans-admin.component.html',
  styleUrls: ['./plans-admin.component.css']
})
export class PlansAdminComponent implements OnInit {
  planes: any[] = [];

  constructor(
    private planService: PlanService,
    private integrationService: IntegrationService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadPlanes();
  }

  loadPlanes() {
    this.planService.getPlanes().subscribe({
      next: (data: any[]) => this.planes = data,
      error: (err: any) => {
        console.error('Error fetching plans', err);
        this.toastService.show('Error al cargar los planes del servidor.', 'danger');
      }
    });
  }

  togglePlan(plan: any) {
    const nuevoEstado = !plan.activo;
    // Bypass temporal de validación de Residencia (Problema 2)
    this.savePlan(plan, nuevoEstado);
  }

  private savePlan(plan: any, activo: boolean) {
    this.planService.activarPlan(plan.id, { ...plan, activo }).subscribe({
      next: () => {
        plan.activo = activo;
        this.toastService.show(
          activo ? `Plan "${plan.nombre}" activado correctamente.` : `Plan "${plan.nombre}" desactivado.`,
          activo ? 'success' : 'info'
        );
      },
      error: (err: any) => {
        console.error('Error al actualizar plan', err);
        this.toastService.show('Error al actualizar el plan.', 'danger');
      }
    });
  }

  // Método "activarPlan" legacy mantenido por compatibilidad con integraciones
  activarPlan(plan: any) {
    this.togglePlan(plan);
  }
}