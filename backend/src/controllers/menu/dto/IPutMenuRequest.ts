export interface IPutMenuRequest {
  nombre?: string;
  descripcion?: string;
  precio?: number;
  categoria?: string;
  imagen_url?: string;
  stock_actual?: number;
  disponible?: boolean;
  fecha_disponible?: Date;
}
