import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class IPostMealPlanRequest {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsNumber()
  @Min(0)
  precio: number;

  @IsString()
  @IsNotEmpty()
  tipo: string;
}