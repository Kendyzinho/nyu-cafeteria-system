import { IsNumber, IsOptional, Min } from 'class-validator';

export class IPutStockRequest {
  @IsOptional()
  @IsNumber()
  @Min(0)
  cantidad?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  umbralMinimo?: number;
}
