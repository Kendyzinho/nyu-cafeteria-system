import { ApiProperty } from '@nestjs/swagger';

export class ILoginRequest {
  @ApiProperty({ 
    example: 'admin@nyu.edu',
    description: 'Email del usuario (ej: admin@nyu.edu o juan@nyu.edu)' 
  })
  email: string;

  @ApiProperty({ 
    example: '123456',
    description: 'Contraseña del usuario' 
  })
  password: string;
}