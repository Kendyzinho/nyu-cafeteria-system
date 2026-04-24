export interface IPutMenuRequest {
  nombre?: string;
  descripcion?: string;
  precio?: number;
  categoria?: string;
  disponible?: boolean;
  stockActual?: number;
  fechaDisponible?: Date;
}