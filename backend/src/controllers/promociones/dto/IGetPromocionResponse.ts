export interface IGetPromocionResponse {
  id: number;
  nombre: string;
  descripcion: string;
  descuento: number;
  horaInicio: string;
  horaFin: string;
  activa: boolean;
  comidasIds?: number[];
}
