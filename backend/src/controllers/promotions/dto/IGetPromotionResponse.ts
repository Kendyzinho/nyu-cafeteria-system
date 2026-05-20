export interface IGetPromotionResponse {
  id: number;
  nombre: string;
  descripcion: string;
  porcentaje_descuento: number;
  hora_inicio_activa: string;
  hora_fin_activa: string;
  activa: boolean;
  comida_id: number;
}
