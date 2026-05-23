import { IsString, IsNumber, IsNotEmpty, IsOptional, IsArray, IsBoolean, Min, Max, Matches } from 'class-validator';

export class IPostPromocionRequest {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  descuento: number;

  @IsString()
  @Matches(/^\d{2}:\d{2}(:\d{2})?$/, { message: 'horaInicio debe tener formato HH:MM o HH:MM:SS' })
  horaInicio: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}(:\d{2})?$/, { message: 'horaFin debe tener formato HH:MM o HH:MM:SS' })
  horaFin: string;

  @IsOptional()
  @IsBoolean()
  activa?: boolean;

  @IsOptional()
  @IsArray()
  comidasIds?: number[];
}
