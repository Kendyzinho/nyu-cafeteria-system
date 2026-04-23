import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Promotion } from '../models/promotion';

@Injectable({
  providedIn: 'root'
})
export class PromotionsService {

  private promotionsMock: Promotion[] = [
    {
      id: 1,
      nombre: 'Descuento estudiante',
      descripcion: '10% de descuento para estudiantes activos',
      descuento: 10,
      fechaInicio: '2026-04-01',
      fechaFin: '2026-04-30',
      activa: true
    },
    {
      id: 2,
      nombre: 'Promo residente',
      descripcion: '15% de descuento para residentes',
      descuento: 15,
      fechaInicio: '2026-04-10',
      fechaFin: '2026-05-10',
      activa: true
    }
  ];

  getPromotions(): Observable<Promotion[]> {
    return of(this.promotionsMock);
  }

  createPromotion(promotion: Promotion): Observable<Promotion> {
    const newPromotion = {
      ...promotion,
      id: this.promotionsMock.length + 1
    };

    this.promotionsMock.push(newPromotion);
    return of(newPromotion);
  }
}