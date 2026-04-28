import { ApiProperty } from '@nestjs/swagger';

export class IPostMealPlanRequest {
  @ApiProperty({ example: 'Plan Matriculado Mensual' })
  nombre: string;

  @ApiProperty({ example: 'Acceso a comedor para alumnos matriculados por 30 días' })
  descripcion: string;

  @ApiProperty({ example: 45000 })
  precio: number;

  @ApiProperty({ example: 'matriculado' })
  tipo: string;
}