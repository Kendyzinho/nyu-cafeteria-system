export interface IGetSubscriptionStatusResponse {
  subscriptionId: number;
  userId: number;
  estado: string;
  mesVigencia: string;
  comidasUsadas: number;
  canjesHoy: number;
  fechaUltimoCanje: string | null;
  plan: {
    id: number;
    nombre: string;
    descripcion: string;
    precioMensual: number;
    cantidadComidas: number;
    limiteDiario: number;
  };
}