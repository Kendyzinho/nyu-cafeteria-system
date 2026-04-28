import { ApiProperty } from '@nestjs/swagger';

export class IPutUserRequest {
  @ApiProperty({ example: 'Juan', required: false })
  nombre?: string;

  @ApiProperty({ example: 'Pérez', required: false })
  apellido?: string;

  @ApiProperty({ example: 'juan@nyu.edu', required: false })
  email?: string;

  @ApiProperty({ example: 'student', required: false })
  tipo?: string;

  @ApiProperty({ example: 1, required: false })
  planId?: number;

  @ApiProperty({ example: true, required: false })
  matriculaActiva?: boolean;

  @ApiProperty({ example: false, required: false })
  residenciaActiva?: boolean;
}