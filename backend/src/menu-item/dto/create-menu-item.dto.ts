import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength, Min } from 'class-validator';

export class CreateMenuItemDto {
  @ApiProperty({ example: 'Milanesa con papas' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @ApiProperty({ example: 8.50 })
  @IsPositive()
  base_price: number;

  @ApiProperty({ example: '2026-04-02' })
  @IsDateString()
  available_date: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  category_id: number;

  @ApiProperty({ required: false, default: 10 })
  @IsInt()
  @Min(0)
  @IsOptional()
  initial_stock?: number;
}
