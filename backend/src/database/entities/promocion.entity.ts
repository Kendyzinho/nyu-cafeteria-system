import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'promocion' })
export class PromocionEntity {
  constructor(data?: Partial<PromocionEntity>) {
    if (data) Object.assign(this, data);
  }

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column()
  descripcion!: string;

  @Column('decimal', { precision: 5, scale: 2, name: 'porcentaje_descuento' })
  porcentaje_descuento!: number;

  @Column({ type: 'time', name: 'hora_inicio_activa' })
  hora_inicio_activa!: string;

  @Column({ type: 'time', name: 'hora_fin_activa' })
  hora_fin_activa!: string;

  @Column({ default: true })
  activa!: boolean;

  @Column({ name: 'comida_id', nullable: true })
  comida_id!: number;
}
