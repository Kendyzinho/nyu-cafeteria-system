import { ApiProperty } from '@nestjs/swagger';

export class IPostStockRequest {
  @ApiProperty({ example: 1 })
  menuItemId: number;

  @ApiProperty({ example: 100 })
  cantidad: number;

  @ApiProperty({ example: 10 })
  umbralMinimo: number;
}