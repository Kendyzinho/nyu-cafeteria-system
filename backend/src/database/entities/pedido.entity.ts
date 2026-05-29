import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { DetallePedidoEntity } from './detalle-pedido.entity';
import { MockUsuarioEntity } from './mock-usuario.entity';

@Entity({ name: 'pedido' })
export class PedidoEntity {
  constructor(data?: Partial<PedidoEntity>) {
    if (data) Object.assign(this, data);
  }

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'usuario_id' })
  usuarioId!: number;

  @ManyToOne(() => MockUsuarioEntity)
  @JoinColumn({ name: 'usuario_id' })
  usuario!: MockUsuarioEntity;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total!: number;

  @Column({ default: 'pendiente' })
  estado!: string;

  @Column({ type: 'int', name: 'orden_pago_id', nullable: true })
  ordenPagoId?: number | null;

  @Column({ name: 'fecha_creacion' })
  fechaCreacion!: Date;

  @Column({ type: 'datetime', name: 'horario_retiro', nullable: true })
  horarioRetiro?: Date | null;

  @OneToMany(() => DetallePedidoEntity, (detalle) => detalle.pedido, { cascade: true, eager: true })
  detalles!: DetallePedidoEntity[];

  get items(): any[] {
    return this.detalles
      ? this.detalles.map((d) => ({
          productId: d.comidaId,
          id: d.comidaId,
          nombre: d.comida ? d.comida.nombre : `Producto #${d.comidaId}`,
          price: Number(d.precioUnitario),
          precio: Number(d.precioUnitario),
          quantity: d.cantidad,
          cantidad: d.cantidad,
        }))
      : [];
  }
}
