import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'pedido' })
export class PedidoEntity {
  constructor(data?: Partial<PedidoEntity>) {
    if (data) Object.assign(this, data);
  }

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'usuario_id' })
  usuario_id!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total!: number;

  @Column({ default: 'pendiente' })
  estado!: string;

  @Column({ name: 'orden_pago_id', nullable: true })
  orden_pago_id!: string;

  @Column({ name: 'fecha_creacion' })
  fecha_creacion!: Date;

  @Column({ name: 'horario_retiro', nullable: true })
  horario_retiro!: string;
}
