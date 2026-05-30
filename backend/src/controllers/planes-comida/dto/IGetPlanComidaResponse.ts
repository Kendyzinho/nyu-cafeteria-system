export interface IGetPlanComidaResponse {
  id: number;
  nombre: string;
  descripcion: string;
  precio_mensual: number;
  cantidadComidas: number;  
  limiteDiario: number; 
  activo: boolean;
}
