import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class IPostStockRequest {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  unidad_medida: string;

  @IsNumber()
  @Min(0)
  stock_Actual: number;

  @IsNumber()
  @Min(0)
  umbral_minimo: number;
}
