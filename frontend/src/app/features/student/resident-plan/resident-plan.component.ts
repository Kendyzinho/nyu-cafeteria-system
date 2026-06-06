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
  currentUser: any = null;

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

  ticketGenerated: boolean = false;
  ticketHora: string = '';

  constructor(
    private planService: PlanService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.cargarPlanesDisponibles();  // siempre carga el catálogo
    this.cargarEstadoPlanActivo();   // HU18: carga el plan activo del usuario
  }

  // ── Carga el catálogo de planes desde GET /meal-plans ──
  private cargarPlanesDisponibles(): void {
    /*
    this.planService.getPlanes().subscribe({
      next: (data: Plan[]) => {
        this.availablePlans = data.map(plan => ({
          ...plan,
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'
        }));
      },
      error: (err) => console.error('Error cargando planes', err)
    });
  }*/
 // Inyectamos los datos falsos directamente:
    this.availablePlans = [
      {
        id: 1,
        nombre: 'Plan Básico (Mensual)',
        descripcion: 'Ideal para estudiantes que asisten 3 días a la semana a la universidad.',
        precio_mensual: 35000,
        cantidad_comidas: 12
      },
      {
        id: 2,
        nombre: 'Plan Residente Full (Premium)',
        descripcion: 'Almuerzos cubiertos para todo el mes. Tranquilidad total.',
        precio_mensual: 60000,
        cantidad_comidas: 20
      }
    ];
  }

  // ── HU18: Carga el plan activo del usuario logueado ──
  private cargarEstadoPlanActivo(): void {
    /*
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.planService.getEstadoPlan(user.id).subscribe({
      next: (data) => {
        this.currentPlan = data;          // guarda toda la respuesta del backend
        this.currentPlanId = data.plan?.id ?? null;
 // marca cuál plan está activo en la UI
      },
      error: () => {
        // 404 = no tiene plan activo todavía, es normal
        this.currentPlan = null;
        this.currentPlanId = null;
      }
    });
  }*/
 this.currentPlanId = 2;
    this.currentPlan = {
      plan: { 
        id: 2, 
        nombre: 'Plan Residente Full', 
        cantidadComidas: 20 
      },
      estado: 'activo',
      mesVigencia: '2026-06-01T00:00:00',
      comidasUsadas: 5
    };
  }

  isResidentPlan(plan: any): boolean {
    return plan.nombre?.toLowerCase().includes('residente');
  }


  // ── HU17: Suscribir al usuario al plan elegido ──
  selectPlan(plan: any): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    if (this.isResidentPlan(plan) && !user.isResident) {
      alert('Este plan está disponible solo para estudiantes residentes.');
      return;
    }

    this.loading = true;
    this.planService.suscribir(user.id, plan.id).subscribe({
      next: (response) => {
        this.loading = false;
        this.currentPlanId = plan.id;
        // Recarga el estado del plan para mostrar datos actualizados (HU18)
        this.cargarEstadoPlanActivo();
        alert('¡Suscripción exitosa! Tu plan ha sido activado.');
      },
      error: (err) => {
        this.loading = false;
        alert('No se pudo completar la suscripción.');
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

    const user = this.authService.getCurrentUser();
    if (!user) return;

    // CÓDIGO REAL ACTIVADO
    this.planService.redimirComida(user.id).subscribe({
      next: (res) => {
        if (this.currentPlan) {
          this.currentPlan.comidasUsadas = res.comidasUsadas;
        }
        
        // Encendemos el modal del Ticket al recibir éxito de la Base de Datos
        this.ticketHora = this.selectedTime;
        this.ticketGenerated = true; 
        this.selectedTime = '';
      },
      error: (err) => {
        if (err.status === 400) {
          alert('Ya usaste todos tus canjes disponibles por hoy.');
        } else {
          alert('No tenés usos disponibles en tu plan este mes.');
        }
      },
    });
  }

  cerrarTicket(): void {
    this.ticketGenerated = false; // Apaga el modal HTML
  }
  

get totalMeals(): number {
  return this.currentPlan?.plan?.cantidadComidas ?? 0;
}
get mealsConsumed(): number {
  return this.currentPlan?.comidasUsadas ?? 0; 
}

get renewalDate(): string {
  if (!this.currentPlan?.mesVigencia) return '';
  const date = new Date(this.currentPlan.mesVigencia);
  date.setMonth(date.getMonth() + 1);
  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' });
}
}