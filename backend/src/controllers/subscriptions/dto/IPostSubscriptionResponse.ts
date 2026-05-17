export interface IPostSubscriptionResponse {
  data: {
    subscriptionId: number;
    userId: number;
    planId: number;
    fechaInicio: string;
    fechaFin: string;
    descuentoAplicado: number;
    precioFinal: number;
  } | null;
  statusCode: number;
  statusDescription: string;
  errors: string | null;
}
