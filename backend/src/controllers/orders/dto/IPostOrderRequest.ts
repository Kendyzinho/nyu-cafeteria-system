import { IsNumber, IsString, IsOptional, Min } from 'class-validator';

export class IPostOrderRequest {
  @IsNumber()
  @Min(1)
  usuario_id: number;

  @IsString()
  @IsOptional()
  horario_retiro?: string;

  @IsString()
  @IsOptional()
  orden_pago_id?: string;
}
