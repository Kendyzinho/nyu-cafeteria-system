import { IsOptional, IsString, IsArray } from 'class-validator';

export class IPutPedidoRequest {
  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsArray()
  items?: any[];
}
