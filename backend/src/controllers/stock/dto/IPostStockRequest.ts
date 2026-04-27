import { IsNumber, Min } from 'class-validator';

export class IPostStockRequest {
  @IsNumber()
  @Min(1)
  menuItemId: number;

  @IsNumber()
  @Min(0)
  cantidad: number;

  @IsNumber()
  @Min(0)
  umbralMinimo: number;
}