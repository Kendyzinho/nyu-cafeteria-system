import { Component, OnInit } from '@angular/core';
import { PlanService } from '../../../core/services/plan.service';

@Component({
  selector: 'app-plans-admin',
  templateUrl: './plans-admin.component.html',
  styleUrls: ['./plans-admin.component.css']
})
export class PlansAdminComponent implements OnInit {
  planes: any[] = [];

  nuevoPlan = {
    nombre: '',
    descripcion: '',
    precio: 0,
    tipo: 'todos',
    activo: true
  };

  editandoId: number | null = null;

  constructor(private planService: PlanService) {}

  ngOnInit() {
    this.cargarPlanes();
  }

  cargarPlanes() {
    this.planService.getPlanes().subscribe({
      next: (data) => this.planes = data,
      error: (err) => console.error('Error al cargar planes', err)
    });
  }

  crearPlan() {
    if (!this.nuevoPlan.nombre || !this.nuevoPlan.precio) {
      alert('Nombre y precio son obligatorios');
      return;
    }

    this.planService.crearPlan(this.nuevoPlan).subscribe({
      next: () => {
        alert('Plan creado exitosamente');
        this.nuevoPlan = { nombre: '', descripcion: '', precio: 0, tipo: 'todos', activo: true };
        this.cargarPlanes();
      },
      error: (err) => alert('Error al crear plan')
    });
  }

  editarPlan(plan: any) {
    this.editandoId = plan.id;
  }

  guardarEdicion(plan: any) {
    this.planService.actualizarPlan(plan.id, {
      nombre: plan.nombre,
      descripcion: plan.descripcion,
      precio: plan.precio,
      tipo: plan.tipo,
      activo: plan.activo
    }).subscribe({
      next: () => {
        this.editandoId = null;
        alert('Plan actualizado');
      },
      error: () => alert('Error al actualizar plan')
    });
  }

  cancelarEdicion() {
    this.editandoId = null;
    this.cargarPlanes();
  }

  eliminarPlan(plan: any) {
    if (!confirm(`¿Eliminar el plan "${plan.nombre}"?`)) return;

    this.planService.eliminarPlan(plan.id).subscribe({
      next: () => {
        this.planes = this.planes.filter(p => p.id !== plan.id);
        alert('Plan eliminado');
      },
      error: () => alert('Error al eliminar plan')
    });
  }
}