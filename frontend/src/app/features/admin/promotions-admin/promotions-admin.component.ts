import { Component, OnInit } from '@angular/core';
import { PromotionService } from '../../../core/services/promotion.service';
import { IntegrationService } from '../../../core/services/integration.service';

@Component({
  selector: 'app-promotions-admin',
  templateUrl: './promotions-admin.component.html',
  styleUrls: ['./promotions-admin.component.css']
})
export class PromotionsAdminComponent implements OnInit {
  promociones: any[] = [];

  constructor(
    private promotionService: PromotionService,
    private integrationService: IntegrationService
  ) {}

  ngOnInit() {
    this.loadPromociones();
  }

  loadPromociones() {
    this.promotionService.getPromociones().subscribe({
      next: (data: any[]) => this.promociones = data,
      error: (err: any) => console.error('Error fetching promotions', err)
    });
  }

  aplicarPromocion(promo: any) {
    this.integrationService.validarEstudianteActivo(promo).subscribe(estudianteValido => {
      if (!estudianteValido) {
        alert('No se puede aplicar: estudiante inactivo');
        return;
      }

      this.integrationService.validarPagoAprobado(promo).subscribe(pagoValido => {
        if (!pagoValido) {
          alert('No se puede aplicar: pago no aprobado');
          return;
        }

        this.promotionService.aplicarPromocion(promo.id, { ...promo, activa: true }).subscribe({
          next: () => {
            alert(`Promoción "${promo.nombre || 'descuento'}" aplicada correctamente`);
            this.loadPromociones();
          },
          error: (err: any) => {
            console.error('Error al aplicar promocion', err);
            alert('Error al aplicar la promoción.');
          }
        });
      });
    });
  }
}