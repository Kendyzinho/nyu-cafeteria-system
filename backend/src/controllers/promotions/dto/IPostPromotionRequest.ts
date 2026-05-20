import { IsString, IsNumber, IsNotEmpty, IsOptional, Min, Max } from 'class-validator';

export class IPostPromotionRequest {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  porcentaje_descuento: number;

  @IsString()
  @IsNotEmpty()
  hora_inicio_activa: string;

  @IsString()
  @IsNotEmpty()
  hora_fin_activa: string;

  @IsNumber()
  @IsOptional()
  comida_id?: number;
}
