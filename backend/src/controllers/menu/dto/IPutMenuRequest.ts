import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class IPutMenuRequest {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  precio?: number;

  @IsString()
  @IsOptional()
  categoria?: string;

  @IsBoolean()
  @IsOptional()
  disponible?: boolean;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stockActual?: number;

  @IsDateString()
  @IsOptional()
  fechaDisponible?: string;
}
