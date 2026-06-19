import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlanService } from '../../../core/services/plan.service';
import { AuthService } from '../../../core/services/auth.service';
import { Plan } from '../../../core/models/plan';

@Component({
  selector: 'app-resident-plan',
  templateUrl: './resident-plan.component.html',
  styleUrls: ['./resident-plan.component.css']
})
export class ResidentPlanComponent implements OnInit {

  // Estado del plan activo
  currentPlan: any = null;
  currentPlanId: number | null = null;
  currentUser: any = null;

  // Lista de planes disponibles
  availablePlans: any[] = [];

  loading = false;
  selectedTime: string = '';
  preferences = {
    vegano: false,
    vegetariano: false,
    sinGluten: false,
    halal: false
  };

  // Gestión de pagos
  showPaymentModal: boolean = false;
  selectedPlanToBuy: any = null;
  isProcessingPayment: boolean = false;

  ticketGenerated: boolean = false;
  ticketHora: string = '';


  constructor(
    private planService: PlanService,
    private authService: AuthService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.cargarPlanesDisponibles();
    this.cargarEstadoPlanActivo();
  }

  // Carga el catálogo de planes
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

  // Carga el plan activo del usuario logueado
  private cargarEstadoPlanActivo(): void {

    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.planService.getEstadoPlan(user.id).subscribe({
      next: (data) => {
        this.currentPlan = data;          // guarda toda la respuesta del backend
        this.currentPlanId = data.plan?.id ?? null;
        // marca cuál plan está activo en la UI
      },
      error: () => {
        // 404: Sin plan activo
        this.currentPlan = null;
        this.currentPlanId = null;
      }
    });
  }


  isResidentPlan(plan: any): boolean {
    return plan.nombre?.toLowerCase().includes('residente');
  }


  // Suscribe al usuario al plan elegido
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
        // Recarga el estado del plan para reflejar la nueva suscripción
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

    // Redime la comida y actualiza el estado
    this.planService.redimirComida(user.id).subscribe({
      next: (res) => {
        if (this.currentPlan) {
          this.currentPlan.comidasUsadas = res.comidasUsadas;
        }

        // Muestra el ticket de confirmación
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

  // Manejo del Modal de Pago
  openPaymentModal(plan: any): void {
    this.selectedPlanToBuy = plan;
    this.showPaymentModal = true;
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
    this.selectedPlanToBuy = null;
    this.isProcessingPayment = false;
  }
  confirmPlanPayment(): void {
    const user = this.authService.getCurrentUser();
    if (!user || !this.selectedPlanToBuy) return;

    this.isProcessingPayment = true;

    // 1. Procesar el pago
    this.http.post<any>('http://localhost:3000/api/pagos/procesar', {
      email: user.email,
      monto: this.selectedPlanToBuy.precio_mensual,
    }).subscribe({
      next: (pagoResult: any) => {
        if (pagoResult.status !== 'APPROVED') {
          this.isProcessingPayment = false;
          alert('El pago fue rechazado. Verifica tus datos.');
          return;
        }

        // 2. Crear la suscripción vinculada a la transacción
        this.planService.suscribir(user.id, this.selectedPlanToBuy.id, pagoResult.transactionId).subscribe({
          next: () => {
            this.isProcessingPayment = false;
            this.closePaymentModal();
            this.cargarEstadoPlanActivo();
            alert('¡Pago exitoso! Tu plan ha sido activado.');
          },
          error: () => {
            this.isProcessingPayment = false;
            alert('El pago fue aprobado pero no se pudo activar el plan. Contacta soporte.');
          }
        });
      },
      error: () => {
        this.isProcessingPayment = false;
        alert('Error al procesar el pago. Intenta de nuevo.');
      }
    });
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