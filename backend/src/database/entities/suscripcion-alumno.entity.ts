import { Column, Entity, PrimaryGeneratedColumn, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { MockUsuarioEntity } from './mock-usuario.entity';
import { PlanesCatalogoEntity } from './planes-catalogo.entity';

@Entity({ name: 'suscripcion_alumno' })
export class SuscripcionAlumnoEntity {
  constructor(data?: Partial<SuscripcionAlumnoEntity>) {
    if (data) Object.assign(this, data);
  }

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'usuario_id' })
  usuarioId!: number;

  @Column({ type: 'int', name: 'plan_id', nullable: true })
  planActivoId?: number | null;

  @Column({ type: 'int', name: 'orden_pago_id', nullable: true })
  ordenPagoId?: number | null;

  @Column({ type: 'date', name: 'mes_vigencia' })
  mesVigencia!: Date;

  @Column({ default: 'activo' })
  estado!: string;
  @Column({ type: 'int', name: 'comidas_usadas', default: 0 })
  comidasUsadas!: number;
  @Column({ type: 'int', name: 'canjes_hoy', default: 0 })
  canjesHoy!: number;

@Column({ type: 'date', name: 'fecha_ultimo_canje', nullable: true })
fechaUltimoCanje?: Date | null;

  @OneToOne(() => MockUsuarioEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario!: MockUsuarioEntity;

  @ManyToOne(() => PlanesCatalogoEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'plan_id' })
  planActivo?: PlanesCatalogoEntity | null;
}
