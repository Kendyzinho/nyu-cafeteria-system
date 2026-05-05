import { Component } from '@angular/core';
import { PromotionService } from '../../../core/services/promotion.service';
import { IntegrationService } from '../../../core/services/integration.service';

@Component({
  selector: 'app-promotions-admin',
  templateUrl: './promotions-admin.component.html',
  styleUrls: ['./promotions-admin.component.css']
})
export class PromotionsAdminComponent {
  promociones: any[] = [];

constructor(
  private promotionService: PromotionService,
  private integrationService: IntegrationService
) {
  this.promociones = this.promotionService.getPromociones();
}

  aplicarPromocion(promo: any) {
  const estudianteValido = this.integrationService.validarEstudianteActivo(promo);
  const pagoValido = this.integrationService.validarPagoAprobado(promo);

  if (!estudianteValido) {
    alert('No se puede aplicar: estudiante inactivo');
    return;
  }

  if (!pagoValido) {
    alert('No se puede aplicar: pago no aprobado');
    return;
  }

  this.promotionService.aplicarPromocion(promo);
  alert(`Promoción "${promo.nombre}" aplicada correctamente`);
}
}