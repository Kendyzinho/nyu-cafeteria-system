import { IsNumber, IsArray, Min, ValidateNested, IsString, IsISO8601, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class ItemCarritoDto {
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

export class IPostPedidoRequest {
  @IsNumber()
  @Min(1)
  usuarioId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemCarritoDto)
  items: ItemCarritoDto[];

  @IsNotEmpty()
  @IsISO8601()
  horarioRetiro: string;
  @IsOptional()
  @IsNumber()
  ordenPagoId?: number; 
}
