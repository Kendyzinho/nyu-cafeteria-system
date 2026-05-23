export interface IGetStockResponse {
  id: number;
  nombre: string;
  unidad_medida: string;
  stock_Actual: number;
  umbral_minimo: number;
  ultima_actualizacion: Date;
}
