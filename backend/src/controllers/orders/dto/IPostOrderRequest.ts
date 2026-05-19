import { IsNumber, IsArray, Min, ValidateNested, IsString, IsISO8601, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CartItemDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsNumber()
  productId?: number;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsNumber()
  precio?: number;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  cantidad?: number;

  @IsOptional()
  @IsNumber()
  quantity?: number;
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