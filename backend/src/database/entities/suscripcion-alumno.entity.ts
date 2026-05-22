import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
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

  @OneToOne(() => MockUsuarioEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario!: MockUsuarioEntity;

  @OneToOne(() => PlanesCatalogoEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'plan_id' })
  planActivo?: PlanesCatalogoEntity | null;
}
