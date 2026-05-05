import { IsString, IsNumber, IsNotEmpty, IsDateString, Min, Max } from 'class-validator';

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
  descuento: number;

  @IsDateString()
  fechaInicio: Date;

  @IsDateString()
  fechaFin: Date;
}