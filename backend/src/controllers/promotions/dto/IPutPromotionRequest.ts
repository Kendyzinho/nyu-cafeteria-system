import { ApiProperty } from '@nestjs/swagger';

export class IPutPromotionRequest {
  @ApiProperty({ example: 'Promo Estudiantil Verano', required: false })
  nombre?: string;

  @ApiProperty({ example: '15% de descuento por temporada de verano', required: false })
  descripcion?: string;

  @ApiProperty({ example: 15, required: false })
  descuento?: number;

  @ApiProperty({ example: '2026-05-01', required: false })
  fechaInicio?: Date;

  @ApiProperty({ example: '2026-05-31', required: false })
  fechaFin?: Date;

  @ApiProperty({ example: true, required: false })
  activa?: boolean;
}