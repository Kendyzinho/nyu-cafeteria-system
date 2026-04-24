import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsPositive, IsString, Max, MaxLength } from 'class-validator';
import { ProfileType } from '../promotion.entity';

export class CreatePromotionDto {
  @ApiProperty({ example: 'Descuento Residente' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ enum: ProfileType })
  @IsEnum(ProfileType)
  profile_type: ProfileType;

  @ApiProperty({ example: 15.00, description: 'Porcentaje de descuento (0-100)' })
  @IsPositive()
  @Max(100)
  discount_pct: number;

  @ApiProperty({ example: '2026-04-01' })
  @IsDateString()
  valid_from: string;

  @ApiProperty({ example: '2026-04-30' })
  @IsDateString()
  valid_to: string;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
