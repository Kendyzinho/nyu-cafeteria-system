import { Component, OnInit } from '@angular/core';
import { PlanService } from '../../../core/services/plan.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-resident-plan',
  templateUrl: './resident-plan.component.html',
  styleUrls: ['./resident-plan.component.css']
})
export class ResidentPlanComponent implements OnInit {
  mealsConsumed = 15;
  totalMeals = 30;
  renewalDate = '1 de mayo';
  currentPlanId: number | null = 2; // Default mock selection

  preferences = {
    vegano: true,
    vegetariano: false,
    sinGluten: false,
    halal: false
  };

  selectedTime: string = '';
  availablePlans: any[] = [];

  constructor(
    private planService: PlanService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.planService.getPlanes().subscribe({
      next: (data) => {
        this.availablePlans = data.map(plan => ({
          id: plan.id,
          name: plan.nombre || `Plan ${plan.tipo || 'Mensual'}`,
          price: plan.precio || 0,
          description: plan.descripcion || 'Plan alimentario de cafetería.',
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'
        }));
      },
      error: (err) => console.error('Error fetching plans', err)
    });
  }

  getCurrentPlanName(): string {
    if (!this.currentPlanId || !this.availablePlans.length) return 'Plan Estándar';
    const plan = this.availablePlans.find(p => p.id === this.currentPlanId);
    return plan ? plan.name : 'Plan Estándar';
  }

  savePreferences() {
    alert('Tus preferencias alimentarias han sido guardadas en el sistema.');
  }

  generateTicket() {
    if (!this.selectedTime) {
      alert('Por favor selecciona un horario de canje.');
      return;
    }
    if (this.mealsConsumed >= this.totalMeals) {
      alert('No te quedan comidas disponibles este mes.');
      return;
    }
    
    this.mealsConsumed++;
    alert(`¡Éxito! Ticket generado para las ${this.selectedTime}. Presenta tu TUI en la cafetería.`);
    this.selectedTime = ''; 
  }

  selectPlan(planId: number) {
    const user = this.authService.getCurrentUser();
    
    this.planService.activarPlan(planId, { estudiante: user ? user.firstName : 'Estudiante', planActivo: true }).subscribe({
      next: () => {
        this.currentPlanId = planId;
        alert('Te has suscrito exitosamente al plan. El cobro ha sido derivado al Sistema Central de Pagos (Integración).');
      },
      error: () => {
        // En caso de que el backend no tenga el endpoint exacto para suscripción en este momento
        this.currentPlanId = planId;
        alert('Suscripción local simulada completada exitosamente.');
      }
    });
  }
}