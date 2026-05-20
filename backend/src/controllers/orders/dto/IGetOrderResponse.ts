export interface IGetOrderResponse {
  id: number;
  usuario_id: number;
  total: number;
  estado: string;
  orden_pago_id: string;
  fecha_creacion: Date;
  horario_retiro: string;
}
