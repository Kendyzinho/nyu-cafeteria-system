export interface Promotion {
  id: number;
  nombre: string;
  descripcion: string;
  descuento: number;
  fechaInicio: string;
  fechaFin: string;
  activa: boolean;
}