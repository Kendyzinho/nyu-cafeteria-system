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

  @Column('text')
  descripcion!: string;

  @Column('decimal', { name: 'porcentaje_descuento', precision: 10, scale: 2 })
  descuento!: number;

  @Column({ name: 'hora_inicio_activa', type: 'time' })
  horaInicio!: string;

  @Column({ name: 'hora_fin_activa', type: 'time' })
  horaFin!: string;

  @Column({ type: 'tinyint', default: 1 })
  activa!: boolean;

  @Column('json', { name: 'comidas_ids', nullable: true })
  comidasIds?: number[] | null;

  // Lógica de negocio derivada (no se guarda en BD)
  get reqMatricula(): boolean {
    return true; // Todas las promociones requieren matrícula activa
  }

  get reqResidencia(): boolean {
    return this.nombre?.toLowerCase().includes('residente') ?? false;
  }
}
