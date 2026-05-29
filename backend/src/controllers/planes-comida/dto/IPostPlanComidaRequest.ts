import { IsString, IsNumber, IsNotEmpty, IsBoolean, IsOptional, Min } from 'class-validator';

export class IPostPlanComidaRequest {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsNumber()
  @Min(0)
  precio_mensual: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
  @IsNumber()
  @Min(0)
  cantidadComidas: number; 
  @IsNumber()
  @Min(1)
  limiteDiario: number;       
}
