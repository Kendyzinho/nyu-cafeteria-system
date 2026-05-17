import { Component, OnInit } from '@angular/core';
import { PlanService } from '../../../core/services/plan.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-resident-plan',
  templateUrl: './resident-plan.component.html',
  styleUrls: ['./resident-plan.component.css']
})
export class ResidentPlanComponent implements OnInit {
  availablePlans: any[] = [];

  currentPlanId: number | null = null;
  currentPlan: any = null;

  mealsConsumed = 0;
  totalMeals = 0;
  renewalDate = '';

  selectedTime: string = '';

  loading = false;
  successMessage = '';
  errorMessage = '';

  preferences = {
    vegano: false,
    vegetariano: false,
    sinGluten: false,
    halal: false
  };

  constructor(
    private planService: PlanService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadPlans();
    this.loadActivePlan();
    this.loadPreferences();
  }

  loadPlans(): void {
    this.loading = true;

    this.planService.getPlanes().subscribe({
      next: (data) => {
        this.availablePlans = data.map(plan => ({
          id: plan.id,
          name: plan.nombre || `Plan ${plan.tipo || 'Mensual'}`,
          type: plan.tipo || 'Mensual',
          price: Number(plan.precio) || 0,
          description: plan.descripcion || 'Plan alimentario mensual para estudiantes residentes.',
          image: this.getPlanImage(plan.tipo)
        }));

        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar los planes disponibles.';
        this.loading = false;
      }
    });
  }

  selectPlan(planId: number): void {
    const selectedPlan = this.availablePlans.find(plan => plan.id === planId);

    if (!selectedPlan) {
      this.errorMessage = 'El plan seleccionado no existe.';
      return;
    }

    const user = this.authService.getCurrentUser();

    const activePlan = {
      userId: user?.id || null,
      studentName: user ? `${user.firstName} ${user.lastName}` : 'Estudiante residente',
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      planType: selectedPlan.type,
      price: selectedPlan.price,
      description: selectedPlan.description,
      status: 'Activo',
      startDate: new Date().toISOString(),
      renewalDate: this.calculateRenewalDate(),
      totalMeals: this.getTotalMealsByPlan(selectedPlan.type, selectedPlan.name),
      mealsConsumed: 0
    };

    localStorage.setItem('active_meal_plan', JSON.stringify(activePlan));

    this.currentPlanId = activePlan.planId;
    this.currentPlan = activePlan;
    this.totalMeals = activePlan.totalMeals;
    this.mealsConsumed = activePlan.mealsConsumed;
    this.renewalDate = activePlan.renewalDate;

    this.successMessage = `Te suscribiste correctamente a ${selectedPlan.name}.`;
    this.errorMessage = '';
  }

  loadActivePlan(): void {
    const savedPlan = localStorage.getItem('active_meal_plan');

    if (!savedPlan) {
      this.currentPlanId = null;
      this.currentPlan = null;
      this.totalMeals = 0;
      this.mealsConsumed = 0;
      this.renewalDate = '';
      return;
    }

    const activePlan = JSON.parse(savedPlan);

    this.currentPlanId = activePlan.planId;
    this.currentPlan = activePlan;
    this.totalMeals = activePlan.totalMeals;
    this.mealsConsumed = activePlan.mealsConsumed;
    this.renewalDate = activePlan.renewalDate;
  }

  cancelPlan(): void {
    localStorage.removeItem('active_meal_plan');

    this.currentPlanId = null;
    this.currentPlan = null;
    this.mealsConsumed = 0;
    this.totalMeals = 0;
    this.renewalDate = '';

    this.successMessage = 'El plan activo fue cancelado correctamente.';
    this.errorMessage = '';
  }

  savePreferences(): void {
    localStorage.setItem('meal_preferences', JSON.stringify(this.preferences));
    this.successMessage = 'Tus preferencias alimentarias fueron guardadas.';
    this.errorMessage = '';
  }

  loadPreferences(): void {
    const savedPreferences = localStorage.getItem('meal_preferences');

    if (savedPreferences) {
      this.preferences = JSON.parse(savedPreferences);
    }
  }

  generateTicket(): void {
    if (!this.currentPlan) {
      this.errorMessage = 'Primero debes suscribirte a un plan mensual.';
      this.successMessage = '';
      return;
    }

    if (!this.selectedTime) {
      this.errorMessage = 'Por favor selecciona un horario de canje.';
      this.successMessage = '';
      return;
    }

    if (this.mealsConsumed >= this.totalMeals) {
      this.errorMessage = 'No te quedan comidas disponibles este mes.';
      this.successMessage = '';
      return;
    }

    this.mealsConsumed++;

    const updatedPlan = {
      ...this.currentPlan,
      mealsConsumed: this.mealsConsumed
    };

    localStorage.setItem('active_meal_plan', JSON.stringify(updatedPlan));
    this.currentPlan = updatedPlan;

    this.successMessage = `Ticket generado para las ${this.selectedTime}. Presenta tu TUI en cafetería.`;
    this.errorMessage = '';
    this.selectedTime = '';
  }

  getCurrentPlanName(): string {
    return this.currentPlan ? this.currentPlan.planName : 'Sin plan activo';
  }

  getRemainingMeals(): number {
    return this.totalMeals - this.mealsConsumed;
  }

  getTotalMealsByPlan(type: string, name: string): number {
    const text = `${type} ${name}`.toLowerCase();

    if (text.includes('full') || text.includes('residente')) return 90;
    if (text.includes('flex')) return 60;

    return 30;
  }

  calculateRenewalDate(): string {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);

    return date.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  getPlanImage(type: string): string {
    const normalizedType = type?.toLowerCase() || '';

    if (normalizedType.includes('full') || normalizedType.includes('residente')) {
      return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80';
    }

    if (normalizedType.includes('flex')) {
      return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80';
    }

    return 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=300&q=80';
  }
}