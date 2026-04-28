import { ApiProperty } from '@nestjs/swagger';

export class IPutMenuRequest {
  @ApiProperty({ example: 'Pizza Pepperoni Familiar', required: false })
  nombre?: string;

  @ApiProperty({ example: 'Pizza clásica con pepperoni, extra queso y borde de queso', required: false })
  descripcion?: string;

  @ApiProperty({ example: 15000, required: false })
  precio?: number;

  @ApiProperty({ example: 'Comida Rápida', required: false })
  categoria?: string;

  @ApiProperty({ example: true, required: false })
  disponible?: boolean;

  @ApiProperty({ example: 25, required: false })
  stockActual?: number;

  @ApiProperty({ example: '2026-04-28', required: false })
  fechaDisponible?: Date;
}