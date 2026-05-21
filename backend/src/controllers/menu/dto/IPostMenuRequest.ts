import { IsString, IsNumber, IsNotEmpty, IsOptional, IsBoolean, Min } from 'class-validator';

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

  @IsOptional()
  @IsBoolean()
  disponible?: boolean;

  @IsNumber()
  @Min(0)
  stock_actual: number;

  @IsString()
  @IsOptional()
  imagen_url?: string;
}
