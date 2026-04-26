import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  private promociones = [
    {
      id: 1,
      nombre: 'Descuento estudiante activo',
      descuento: 15,
      estudianteActivo: true,
      residenciaActiva: false,
      pagoAprobado: true,
      activa: false
    },
    {
      id: 2,
      nombre: 'Beneficio residente NYU',
      descuento: 25,
      estudianteActivo: true,
      residenciaActiva: true,
      pagoAprobado: true,
      activa: false
    },
    {
      id: 3,
      nombre: 'Promoción pendiente por pago',
      descuento: 10,
      estudianteActivo: true,
      residenciaActiva: true,
      pagoAprobado: false,
      activa: false
    }
  ];

  getPromociones() {
    return this.promociones;
  }

  aplicarPromocion(promo: any) {
    const index = this.promociones.findIndex(p => p.id === promo.id);

    if (index !== -1) {
      this.promociones[index].activa = true;
    }

    return this.promociones[index];
  }
}