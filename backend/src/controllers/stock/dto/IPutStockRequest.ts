import { ApiProperty } from '@nestjs/swagger';

export class IPutStockRequest {
  @ApiProperty({ example: 120, required: false })
  cantidad?: number;

  @ApiProperty({ example: 15, required: false })
  umbralMinimo?: number;
}