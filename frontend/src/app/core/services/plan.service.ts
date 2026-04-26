import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  private planes = [
    {
      id: 1,
      estudiante: 'Alejandro Ruiz',
      residenciaActiva: true,
      nombrePlan: 'Plan mensual residente',
      planActivo: true,
      consumos: 12,
      limiteConsumos: 30
    },
    {
      id: 2,
      estudiante: 'Camila Torres',
      residenciaActiva: true,
      nombrePlan: 'Plan mensual residente',
      planActivo: false,
      consumos: 0,
      limiteConsumos: 30
    },
    {
      id: 3,
      estudiante: 'Matías Rojas',
      residenciaActiva: false,
      nombrePlan: 'Plan mensual residente',
      planActivo: false,
      consumos: 0,
      limiteConsumos: 30
    }
  ];

  getPlanes() {
    return this.planes;
  }

  activarPlan(plan: any) {
    const index = this.planes.findIndex(p => p.id === plan.id);

    if (index !== -1) {
      this.planes[index].planActivo = true;
    }

    return this.planes[index];
  }
}