import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'suscripcion_alumno' })
export class SuscripcionAlumnoEntity {
  constructor(data?: Partial<SuscripcionAlumnoEntity>) {
    if (data) Object.assign(this, data);
  }

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'usuario_id' })
  usuario_id!: number;

  @Column({ name: 'plan_id' })
  plan_id!: number;

  @Column({ name: 'orden_pago_id', nullable: true })
  orden_pago_id!: string;

  @Column({ name: 'mes_vigencia' })
  mes_vigencia!: string;

  @Column({ default: 'activo' })
  estado!: string;
}
