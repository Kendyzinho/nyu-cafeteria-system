import { IsString, IsNumber, IsOptional, IsEmail, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class DatosTarjetaDto {
  @IsOptional()
  @IsString()
  titular?: string;

  @IsOptional()
  @IsString()
  numeroTarjeta?: string;

  @IsOptional()
  @IsString()
  fechaVencimiento?: string;

  @IsOptional()
  @IsString()
  cvv?: string;
}

export class IPostPagoRequest {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsNumber()
  @Min(0)
  monto: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => DatosTarjetaDto)
  datosTarjeta?: DatosTarjetaDto;
}