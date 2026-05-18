import { IsNumber, IsArray, Min, ValidateNested, IsString, IsISO8601, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CartItemDto {
  @IsNumber()
  id: number;

  @IsString()
  nombre: string;

  @IsNumber()
  precio: number;

  @IsNumber()
  cantidad: number;
}

export class IPostOrderRequest {
  @IsNumber()
  @Min(1)
  usuarioId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];

  @IsNotEmpty()
  @IsISO8601()
  horarioRetiro: string;
}