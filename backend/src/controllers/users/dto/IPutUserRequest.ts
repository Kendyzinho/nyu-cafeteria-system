import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class IPutUserRequest {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  apellido?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  tipo?: string;

  @IsInt()
  @IsOptional()
  planId?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
