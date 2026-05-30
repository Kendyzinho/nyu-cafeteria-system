export interface IPutPlanComidaRequest {
  nombre?: string;
  descripcion?: string;
  precio_mensual?: number;
  cantidadComidas?: number;
  limiteDiario?: number; 
  activo?: boolean;
}
