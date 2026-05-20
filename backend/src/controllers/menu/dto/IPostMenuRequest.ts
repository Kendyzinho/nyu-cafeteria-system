import { IsString, IsNumber, IsNotEmpty, IsDateString, IsOptional, IsBoolean, Min } from 'class-validator';

export class IPostMenuRequest {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsNumber()
  @Min(0)
  precio: number;

  @IsString()
  @IsNotEmpty()
  categoria: string;

  @IsString()
  @IsOptional()
  imagen_url?: string;

  @IsNumber()
  @Min(0)
  stock_actual: number;

  @IsBoolean()
  @IsOptional()
  disponible?: boolean;

  @IsDateString()
  @IsOptional()
  fecha_disponible?: Date;
}
