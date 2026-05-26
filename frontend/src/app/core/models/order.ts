export interface OrderItem {
  id: number;
  pedidoId: number;
  comidaId: number;
  cantidad: number;
  precioUnitario: number;
}

export interface Order {
  id: number;
  usuarioId: number;
  total: number;
  estado: string;
  ordenPagoId?: number | null;
  fechaCreacion: string;
  horarioRetiro?: string | null;
  items?: any[]; // Aliased by backend
  detalles?: OrderItem[];
}
