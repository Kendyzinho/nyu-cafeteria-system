import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, Min, Max, Matches } from 'class-validator';

export class IPutPromocionRequest {
  @IsOptional() @IsString() nombre?: string;
  @IsOptional() @IsString() descripcion?: string;
  @IsOptional() @IsNumber() @Min(0) @Max(100) descuento?: number;
  @IsOptional() @IsString() @Matches(/^\d{2}:\d{2}(:\d{2})?$/) horaInicio?: string;
  @IsOptional() @IsString() @Matches(/^\d{2}:\d{2}(:\d{2})?$/) horaFin?: string;
  @IsOptional() @IsBoolean() activa?: boolean;
  @IsOptional() @IsArray() comidasIds?: number[];
}