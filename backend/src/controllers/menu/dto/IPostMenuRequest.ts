import { IsString, IsNumber, IsNotEmpty, IsDateString, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class IPostMenuRequest {
  @ApiProperty({ example: 'Arepa de Choclo' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'Arepa dulce de maíz con queso' })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({ example: 5.50 })
  @IsNumber()
  @Min(0)
  precio: number;

  @ApiProperty({ example: 'Desayuno', enum: ['Desayuno', 'Almuerzo', 'Cena', 'Snack'] })
  @IsString()
  @IsNotEmpty()
  categoria: string;

  @ApiProperty({ example: 20 })
  @IsNumber()
  @Min(0)
  stockActual: number;

  @ApiProperty({ example: '2026-04-24' })
  @IsDateString()
  fechaDisponible: Date;

  @ApiPropertyOptional({ example: 'https://example.com/imagen.jpg' })
  @IsString()
  @IsOptional()
  image?: string;
}
