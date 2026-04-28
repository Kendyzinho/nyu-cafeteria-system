import { ApiProperty } from '@nestjs/swagger';

export class IPutMealPlanRequest {
  @ApiProperty({ example: 'Plan Matriculado Semestral', required: false })
  nombre?: string;

  @ApiProperty({ example: 'Acceso a comedor para alumnos matriculados por todo el semestre', required: false })
  descripcion?: string;

  @ApiProperty({ example: 180000, required: false })
  precio?: number;

  @ApiProperty({ example: 'matriculado', required: false })
  tipo?: string;

  @ApiProperty({ example: true, required: false })
  activo?: boolean;
}