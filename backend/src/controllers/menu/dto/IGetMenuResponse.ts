export interface IGetMenuResponse {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen_url: string;
  stock_actual: number;
  disponible: boolean;
  precio_estudiante: number;
}
