import { IsString, IsNumber, IsNotEmpty, IsDateString, IsOptional, Min } from 'class-validator';

export class IPostMenuRequest {

  @IsString()     // debe ser texto
  @IsNotEmpty()   // no puede estar vacío
  nombre: string;

  @IsString()     // debe ser texto
  @IsNotEmpty()   // no puede estar vacío
  descripcion: string;

  @IsNumber()     // debe ser número
  @Min(0)         // no puede ser negativo
  precio: number;

  @IsString()     // debe ser texto
  @IsNotEmpty()   // no puede estar vacío
  categoria: string;

  @IsNumber()     // debe ser número
  @Min(0)         // mínimo 0
  stockActual: number;

  @IsDateString() // debe ser una fecha válida (ej. "2026-04-24")
  fechaDisponible: Date;

  @IsString()     // debe ser texto
  @IsOptional()   // campo opcional, puede no enviarse
  image?: string;
}