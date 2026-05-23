import { Component, OnInit } from '@angular/core';
import { PromotionService } from '../../../core/services/promotion.service';

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

  constructor(
    private promotionService: PromotionService
  ) {}

  ngOnInit() {
    this.loadPromociones();
  }

  loadPromociones() {
    this.promotionService.getPromociones().subscribe({
      next: (data: Promocion[]) => this.promociones = data,
      error: (err: any) => console.error('Error fetching promotions', err)
    });
  }

  aplicarPromocion(promo: Promocion) {
    this.promotionService.aplicarPromocion(promo.id, { ...promo, activa: !promo.activa }).subscribe({
      next: () => {
        alert(`Promoción "${promo.nombre || 'descuento'}" ${!promo.activa ? 'activada' : 'desactivada'} correctamente`);
        this.loadPromociones();
      },
      error: (err: any) => {
        console.error('Error al actualizar promoción', err);
        alert('Error al actualizar la promoción.');
      }
    });
  }
}