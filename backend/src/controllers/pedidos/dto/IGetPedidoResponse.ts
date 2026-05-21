export interface IGetPedidoResponse {
  id: number;
  usuarioId: number;
  items: any[];
  total: number;
  estado: string;
  fechaCreacion: Date;
}
