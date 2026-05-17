export interface IGetSubscriptionStatusResponse {
  subscriptionId: number;
  activa: boolean;
  plan: {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    tipo: string;
  };
  fechaInicio: string;
  fechaFin: string;
  consumosUsados: number;
  consumosDisponibles: number;
  descuentoAplicado: number;
  precioFinal: number;
}
