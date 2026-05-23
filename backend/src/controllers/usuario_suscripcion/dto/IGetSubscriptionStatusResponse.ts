export interface IGetSubscriptionStatusResponse {
  subscriptionId: number;
  userId: number;
  estado: string;
  mesVigencia: string;
  plan: {
    id: number;
    nombre: string;
    descripcion: string;
    precioMensual: number;
  };
}