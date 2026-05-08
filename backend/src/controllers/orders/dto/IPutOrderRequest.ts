import { IsArray, IsOptional, IsString } from 'class-validator';

export class IPutOrderRequest {
  @IsString()
  @IsOptional()
  estado?: string;

  @IsArray()
  @IsOptional()
  items?: any[];
}
