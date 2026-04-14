export interface IPutPromotionRequest {
  nombre?: string;
  descripcion?: string;
  descuento?: number;
  fechaInicio?: Date;
  fechaFin?: Date;
  activa?: boolean;
}