import { IsNumber, IsOptional, Min } from 'class-validator';

export class IPutStockRequest {
  @IsNumber()
  @Min(0)
  @IsOptional()
  cantidad?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  umbralMinimo?: number;
}
