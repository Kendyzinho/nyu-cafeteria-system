import { Component, OnInit } from '@angular/core';
import { PlanService } from '../../../core/services/plan.service';
import { AuthService } from '../../../core/services/auth.service';
import { Plan } from '../../../core/models/plan';

@Component({
  selector: 'app-resident-plan',
  templateUrl: './resident-plan.component.html',
  styleUrls: ['./resident-plan.component.css']
})
export class ResidentPlanComponent implements OnInit {

  // ── Estado del plan activo (viene de HU18) ──
  currentPlan: any = null;       // objeto con { plan, estado, mesVigencia, ... }
  currentPlanId: number | null = null;

  // ── Lista de planes disponibles (viene de GET /meal-plans) ──
  availablePlans: any[] = [];

  // ── UI ──
  loading = false;
  selectedTime: string = '';
  preferences = {
    vegano: false,
    vegetariano: false,
    sinGluten: false,
    halal: false
  };

  selectedTime: string = '';
  availablePlans: (Plan & { image?: string })[] = [];

  constructor(
    private planService: PlanService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarPlanesDisponibles();  // siempre carga el catálogo
    this.cargarEstadoPlanActivo();   // HU18: carga el plan activo del usuario
  }

  // ── Carga el catálogo de planes desde GET /meal-plans ──
  private cargarPlanesDisponibles(): void {
    this.planService.getPlanes().subscribe({
      next: (data: Plan[]) => {
        this.availablePlans = data.map(plan => ({
          ...plan,
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'
        }));
      },
      error: (err) => console.error('Error cargando planes', err)
    });
  }

  // ── HU18: Carga el plan activo del usuario logueado ──
  private cargarEstadoPlanActivo(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.planService.getEstadoPlan(user.id).subscribe({
      next: (data) => {
        this.currentPlan = data;          // guarda toda la respuesta del backend
        this.currentPlanId = data.planId; // marca cuál plan está activo en la UI
      },
      error: () => {
        // 404 = no tiene plan activo todavía, es normal
        this.currentPlan = null;
        this.currentPlanId = null;
      }
    });
  }

  // ── HU17: Suscribir al usuario al plan elegido ──
  selectPlan(planId: number): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.loading = true;
    this.planService.suscribir(user.id, planId).subscribe({
      next: (response) => {
        this.loading = false;
        this.currentPlanId = planId;
        // Recarga el estado del plan para mostrar datos actualizados (HU18)
        this.cargarEstadoPlanActivo();
        alert('¡Suscripción exitosa! Tu plan ha sido activado.');
      },
      error: (err) => {
        this.loading = false;
        alert('No se pudo completar la suscripción. Verifica que tu cuenta es de tipo residente.');
        console.error(err);
      }
    });
  }

  getCurrentPlanName(): string {
    if (!this.currentPlan) return 'Sin plan activo';
    return this.currentPlan.plan?.nombre ?? 'Plan activo';
  }

  savePreferences(): void {
    alert('Preferencias guardadas.');
  }

  cancelPlan(): void {
    alert('Funcionalidad de cancelación próximamente.');
  }

  generateTicket(): void {
    if (!this.selectedTime) {
      alert('Selecciona un horario primero.');
      return;
    }
    alert(`Ticket generado para las ${this.selectedTime}. Presenta tu TUI en la cafetería.`);
    this.selectedTime = '';
  }
  get totalMeals(): number {
  if (!this.currentPlan?.plan?.nombre) return 0;
  const match = this.currentPlan.plan.nombre.match(/(\d+)\s*[Cc]omidas?/);
  return match ? parseInt(match[1]) : 0;
}

get mealsConsumed(): number {
  return 0;
}

get renewalDate(): string {
  if (!this.currentPlan?.mesVigencia) return '';
  const date = new Date(this.currentPlan.mesVigencia);
  date.setMonth(date.getMonth() + 1);
  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' });
}
}