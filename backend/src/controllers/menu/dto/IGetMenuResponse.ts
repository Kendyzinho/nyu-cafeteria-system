export interface IGetMenuResponse {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  disponible: boolean;
  stockActual: number;
  fechaDisponible: Date;
  precioEstudiante: number;
  image: string;
}