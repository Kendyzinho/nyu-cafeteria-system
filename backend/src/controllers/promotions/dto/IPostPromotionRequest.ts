import { ApiProperty } from '@nestjs/swagger';

export class IPostPromotionRequest {
  @ApiProperty({ example: 'Promo Estudiantil' })
  nombre: string;

  @ApiProperty({ example: '10% de descuento para alumnos matriculados' })
  descripcion: string;

  @ApiProperty({ example: 10 })
  descuento: number;

  @ApiProperty({ example: '2026-05-01' })
  fechaInicio: Date;

  @ApiProperty({ example: '2026-05-31' })
  fechaFin: Date;
}