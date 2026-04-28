import { ApiProperty } from '@nestjs/swagger';

class OrderItemDTO {
  @ApiProperty({ example: 1, description: 'ID del producto del menú' })
  id: number;

  @ApiProperty({ example: 2, description: 'Cantidad' })
  cantidad: number;
}

export class ICheckoutRequest {
  @ApiProperty({ example: 6, description: 'ID del usuario que compra (ej: Juan es el 6)' })
  usuarioId: number;

  @ApiProperty({ type: [OrderItemDTO], description: 'Lista de productos' })
  items: OrderItemDTO[];

  @ApiProperty({ example: '2026-04-28 15:00:00', required: false, description: 'Fecha opcional de retiro' })
  fechaRetiro?: string;
}
