import { IsOptional, IsString, IsArray } from 'class-validator';

export class IPutOrderRequest {
  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsArray()
  items?: any[];
}