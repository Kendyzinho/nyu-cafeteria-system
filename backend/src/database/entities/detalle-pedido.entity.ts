import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { PedidoEntity } from './pedido.entity';
import { ComidaEntity } from './comida.entity';

@Entity({ name: 'detalle_pedido' })
export class DetallePedidoEntity {
  constructor(data?: Partial<DetallePedidoEntity>) {
    if (data) Object.assign(this, data);
  }

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'pedido_id' })
  pedidoId!: number;

  @Column({ name: 'comida_id' })
  comidaId!: number;

  @Column()
  cantidad!: number;

  @Column('decimal', { name: 'precio_unitario', precision: 10, scale: 2 })
  precioUnitario!: number;

  @ManyToOne(() => PedidoEntity, (pedido) => pedido.detalles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pedido_id' })
  pedido!: PedidoEntity;

  @ManyToOne(() => ComidaEntity, { eager: true })
  @JoinColumn({ name: 'comida_id' })
  comida!: ComidaEntity;
}
