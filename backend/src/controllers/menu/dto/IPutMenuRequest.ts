import { IsString, IsNumber, IsBoolean, IsDateString, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class IPutMenuRequest {
  @ApiPropertyOptional({ example: 'Arepa de Choclo' })
  @IsString()
  @IsOptional()
  nombre?: string;

  @ApiPropertyOptional({ example: 'Arepa dulce de maíz con queso' })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiPropertyOptional({ example: 5.50 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  precio?: number;

  @ApiPropertyOptional({ example: 'Almuerzo', enum: ['Desayuno', 'Almuerzo', 'Cena', 'Snack'] })
  @IsString()
  @IsOptional()
  categoria?: string;
  imagen_url?: string;
  stock_actual?: number;
  disponible?: boolean;
}
