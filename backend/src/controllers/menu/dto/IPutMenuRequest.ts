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

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  disponible?: boolean;

  @ApiPropertyOptional({ example: 15 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  stockActual?: number;

  @ApiPropertyOptional({ example: '2026-04-24' })
  @IsDateString()
  @IsOptional()
  fechaDisponible?: Date;

  @ApiPropertyOptional({ example: 'https://example.com/imagen.jpg' })
  @IsString()
  @IsOptional()
  image?: string;
}
