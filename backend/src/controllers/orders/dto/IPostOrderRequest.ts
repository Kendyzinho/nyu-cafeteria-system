import { IsNumber, IsArray, Min } from 'class-validator';

export class IPostOrderRequest {
  @IsNumber()
  @Min(1)
  usuarioId: number;

  @IsArray()
  items: any[];
}