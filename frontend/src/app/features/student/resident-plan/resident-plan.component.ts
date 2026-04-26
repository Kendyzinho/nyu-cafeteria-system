import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-resident-plan',
  templateUrl: './resident-plan.component.html',
  styleUrls: ['./resident-plan.component.css']
})
export class ResidentPlanComponent implements OnInit {
  // 1. Estado del Plan Actual
  mealsConsumed = 15;
  totalMeals = 30;
  renewalDate = '1 de mayo';
  currentPlanId = 2; // Suponemos que tiene el Estándar por defecto

  // 2. Modelo para Preferencias (Two-Way Binding)
  preferences = {
    vegano: true,
    vegetariano: false,
    sinGluten: false,
    halal: false
  };

  // 3. Modelo para el Ticket
  selectedTime: string = '';

  // 4. Catálogo Dinámico de Planes
  availablePlans = [
    { 
      id: 1, 
      name: 'Plan Flex (15 Comidas)', 
      price: 300000, 
      description: 'Ahorra en tus comidas y mantén flexibilidad. Ideal para quienes cocinan ocasionalmente.',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'
    },
    { 
      id: 2, 
      name: 'Plan Residente Estándar (30 Comidas)', 
      price: 500000, 
      description: 'El plan más popular. Cubre 1 almuerzo al día, de lunes a viernes + algunos fines de semana.',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'
    },
    { 
      id: 3, 
      name: 'Plan Premium Full (60 comidas)', 
      price: 900000, 
      description: 'Cobertura total. Almuerzo y cena todos los días. Máxima comodidad.',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'
    }
  ];

  constructor() { }

  ngOnInit(): void {}

  // Métodos de interacción
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
    
    // Descontamos una comida mágicamente en vivo
    this.mealsConsumed++;
    alert(`¡Éxito! Ticket generado para las ${this.selectedTime}. Presenta tu TUI en la cafetería.`);
    this.selectedTime = ''; // Reiniciamos el select
  }

  selectPlan(planId: number) {
    this.currentPlanId = planId;
    // A futuro aquí se llamaría a la pasarela de pago para el upgrade
  }
}