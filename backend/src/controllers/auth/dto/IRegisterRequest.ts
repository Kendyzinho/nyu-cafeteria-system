import { ApiProperty } from '@nestjs/swagger';

export class IRegisterRequest {
  @ApiProperty({ example: 'Juan' })
  nombre: string;

  @ApiProperty({ example: 'Pérez', required: false })
  apellido: string;

  @ApiProperty({ example: 'nuevo@nyu.edu' })
  email: string;

  @ApiProperty({ example: '123456' })
  password: string;

  @ApiProperty({ example: 'student', enum: ['student', 'admin'] })
  tipo: string;
}