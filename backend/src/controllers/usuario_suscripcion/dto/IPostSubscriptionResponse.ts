export interface IPostSubscriptionResponse {
  data: {
    subscriptionId: number;
    userId: number;
    planId: number;
    nombrePlan: string;
    mesVigencia: string;
    estado: string;
    precioFinal: number;
  } | null;
  statusCode: number;
  statusDescription: string;
  errors: string | null;
}