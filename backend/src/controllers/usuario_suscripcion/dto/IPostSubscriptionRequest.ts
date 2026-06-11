import { IsNumber, IsNotEmpty, Min,IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IPostSubscriptionRequest {
  @ApiProperty({ example: 8, description: 'ID del usuario residente' })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  userId: number;

  @ApiProperty({ example: 2, description: 'ID del plan de comida a suscribir' })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  planId: number;
  @ApiProperty({ example: 7, description: 'ID de la orden de pago aprobada', required: false })
@IsOptional()
@IsNumber()
@Min(1)
ordenPagoId?: number
  
}