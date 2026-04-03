import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateStockDto {
  @ApiProperty({ example: 20 })
  @IsInt()
  @Min(0)
  quantity: number;
}
