import { Component, OnInit } from '@angular/core';
import { PromotionService } from '../../../core/services/promotion.service';
import { MenuService } from '../../../core/services/menu.service';

export interface Promocion {
  id: number;
  nombre: string;
  descripcion: string;
  descuento: number;
  horaInicio: string;
  horaFin: string;
  activa: boolean;
  comidasIds?: number[] | null;
}

@Component({
  selector: 'app-promotions-admin',
  templateUrl: './promotions-admin.component.html',
  styleUrls: ['./promotions-admin.component.css']
})
export class PromotionsAdminComponent implements OnInit {
  promociones: Promocion[] = [];
  alimentos: any[] = [];
  comidasSeleccionadas: number[] = [];
  showForm = false;

  nuevaPromo = {
    nombre: '',
    descripcion: '',
    descuento: 10,
    horaInicio: '08:00',
    horaFin: '20:00',
    activa: true,
  };

  constructor(
    private promotionService: PromotionService,
    private menuService: MenuService
  ) {}

  ngOnInit() {
    this.loadPromociones();
    this.loadAlimentos();
  }

  loadPromociones() {
    this.promotionService.getPromociones().subscribe({
      next: (data: Promocion[]) => this.promociones = data,
      error: (err: any) => console.error('Error fetching promotions', err)
    });
  }

  loadAlimentos() {
    this.menuService.getAll().subscribe({
      next: (data: any[]) => this.alimentos = data,
      error: (err: any) => console.error('Error fetching alimentos', err)
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) this.comidasSeleccionadas = [];
  }

  toggleComida(id: number) {
    const idx = this.comidasSeleccionadas.indexOf(id);
    if (idx === -1) this.comidasSeleccionadas.push(id);
    else this.comidasSeleccionadas.splice(idx, 1);
  }

  isComidaSeleccionada(id: number): boolean {
    return this.comidasSeleccionadas.includes(id);
  }

  crearPromocion() {
    if (!this.nuevaPromo.nombre || !this.nuevaPromo.descuento) {
      alert('Nombre y descuento son obligatorios.');
      return;
    }
    this.promotionService.createPromocion({
      ...this.nuevaPromo,
      horaInicio: this.nuevaPromo.horaInicio + ':00',
      horaFin: this.nuevaPromo.horaFin + ':00',
      comidasIds: this.comidasSeleccionadas.length > 0 ? this.comidasSeleccionadas : null,
    }).subscribe({
      next: () => {
        alert('Promoción creada correctamente.');
        this.showForm = false;
        this.comidasSeleccionadas = [];
        this.nuevaPromo = { nombre: '', descripcion: '', descuento: 10, horaInicio: '08:00', horaFin: '20:00', activa: true };
        this.loadPromociones();
      },
      error: (err: any) => {
        console.error('Error al crear promoción', err);
        alert('Error al crear la promoción.');
      }
    });
  }

  aplicarPromocion(promo: Promocion) {
    this.promotionService.aplicarPromocion(promo.id, { ...promo, activa: !promo.activa }).subscribe({
      next: () => {
        alert(`Promoción "${promo.nombre}" ${!promo.activa ? 'activada' : 'desactivada'} correctamente`);
        this.loadPromociones();
      },
      error: (err: any) => {
        console.error('Error al actualizar promoción', err);
        alert('Error al actualizar la promoción.');
      }
    });
  }

  eliminarPromocion(promo: Promocion) {
    if (!confirm(`¿Eliminar la promoción "${promo.nombre}"? Esta acción no se puede deshacer.`)) return;
    this.promotionService.deletePromocion(promo.id).subscribe({
      next: () => {
        alert('Promoción eliminada.');
        this.loadPromociones();
      },
      error: (err: any) => {
        console.error('Error al eliminar promoción', err);
        alert('Error al eliminar la promoción.');
      }
    });
  }
}