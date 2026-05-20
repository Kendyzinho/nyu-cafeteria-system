import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'detalle_pedido' })
export class DetallePedidoEntity {
  constructor(data?: Partial<DetallePedidoEntity>) {
    if (data) Object.assign(this, data);
  }

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'pedido_id' })
  pedido_id!: number;

  @Column({ name: 'comida_id' })
  comida_id!: number;

  @Column({ default: 1 })
  cantidad!: number;

  @Column('decimal', { precision: 10, scale: 2, name: 'precio_unitario' })
  precio_unitario!: number;
}
