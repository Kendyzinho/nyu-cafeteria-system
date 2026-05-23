export interface IPutPromocionRequest {
  nombre?: string;
  descripcion?: string;
  descuento?: number;
  horaInicio?: string;
  horaFin?: string;
  activa?: boolean;
  comidasIds?: number[];
}
