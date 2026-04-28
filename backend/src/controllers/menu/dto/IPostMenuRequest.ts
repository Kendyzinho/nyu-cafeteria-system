import { ApiProperty } from '@nestjs/swagger';

export class IPostMenuRequest {
  @ApiProperty({ example: 'Pizza Pepperoni' })
  nombre: string;

  @ApiProperty({ example: 'Pizza clásica con pepperoni y extra queso' })
  descripcion: string;

  @ApiProperty({ example: 12500 })
  precio: number;

  @ApiProperty({ example: 'Comida Rápida' })
  categoria: string;

  @ApiProperty({ example: 30 })
  stockActual: number;

  @ApiProperty({ example: '2026-04-28' })
  fechaDisponible: Date;
}