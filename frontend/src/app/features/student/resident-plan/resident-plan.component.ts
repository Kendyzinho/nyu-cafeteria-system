import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-resident-plan',
  templateUrl: './resident-plan.component.html',
  styleUrls: ['./resident-plan.component.css']
})
export class ResidentPlanComponent implements OnInit {
  // Datos simulados del plan del estudiante
  planDetails = {
    name: 'Plan Residente Premium',
    totalMeals: 45,
    consumed: 30,
    remaining: 15,
    nextRenewal: '01-06-2026',
    status: 'Activo'
  };

  // El menú que le corresponde hoy por su plan
  todayMenu = [
    { type: 'Entrada', name: 'Sopa de Calabaza Asada', icon: '🍲' },
    { type: 'Fondo', name: 'Bowl de Quinoa y Pollo Grill', icon: '🥗' },
    { type: 'Postre', name: 'Mousse de Maracuyá', icon: '🍨' },
    { type: 'Bebida', name: 'Jugo de Frambuesa Natural', icon: '🥤' }
  ];

  constructor() { }

  ngOnInit(): void {
    // Aquí a futuro llamaremos a un PlanService para obtener estos datos del backend
  }

  // Calcula el porcentaje para la barra de progreso
  get progressPercentage(): number {
    return (this.planDetails.consumed / this.planDetails.totalMeals) * 100;
  }
}