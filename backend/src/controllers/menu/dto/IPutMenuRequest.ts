export interface IPutMenuRequest {
  nombre?: string;
  descripcion?: string;
  precio?: number;
  categoria?: string;
  disponible?: boolean;
  stock_actual?: number;
  imagen_url?: string;
}