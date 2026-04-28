import { ApiProperty } from '@nestjs/swagger';

export class IPostUserRequest {
  @ApiProperty({ example: 'Nuevo' })
  nombre: string;

  @ApiProperty({ example: 'Usuario' })
  apellido: string;

  @ApiProperty({ example: 'usuario_demo@nyu.edu', description: 'Debe ser un email único' })
  email: string;

  @ApiProperty({ example: '123456' })
  password: string;

  @ApiProperty({ example: 'student', enum: ['student', 'admin'] })
  tipo: string;
}