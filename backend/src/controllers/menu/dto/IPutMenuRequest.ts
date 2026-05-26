import { IsString, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';
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

  @ApiPropertyOptional({ example: 2500 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  precio?: number;

  @ApiPropertyOptional({ example: 'Almuerzo', enum: ['Desayuno', 'Almuerzo', 'Cena', 'Snack'] })
  @IsString()
  @IsOptional()
  categoria?: string;

  @ApiPropertyOptional({ example: 'https://placehold.co/400x300?text=Comida' })
  @IsString()
  @IsOptional()
  imagen_url?: string;

  @ApiPropertyOptional({ example: 10 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  stock_actual?: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  disponible?: boolean;
}
