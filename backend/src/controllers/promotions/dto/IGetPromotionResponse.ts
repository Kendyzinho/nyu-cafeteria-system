export interface IGetPromotionResponse {
  id: number;
  nombre: string;
  descripcion: string;
  descuento: number;
  fechaInicio: Date;
  fechaFin: Date;
  activa: boolean;
}