import { IsString, IsEmail, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class IPostUsuarioRequest {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  tipo: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsOptional()
  @IsBoolean()
  es_residente?: boolean;
}
