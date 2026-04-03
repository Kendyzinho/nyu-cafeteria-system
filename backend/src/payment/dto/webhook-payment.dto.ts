import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { PaymentStatus } from '../payment.entity';

export class WebhookPaymentDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  reference_id: number;

  @ApiProperty({ enum: PaymentStatus })
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @ApiProperty({ required: false, example: 'EXT-REF-123' })
  @IsString()
  @IsOptional()
  external_ref?: string;
}
