import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'promotion' })
export class PromotionEntity {
  constructor(data?: Partial<PromotionEntity>) {
    if (data) Object.assign(this, data);
  }

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column()
  descripcion!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  descuento!: number;

  @Column()
  fechaInicio!: Date;

  @Column()
  fechaFin!: Date;

  @Column({ default: true })
  activa!: boolean;

  @Column({ default: false })
  reqMatricula!: boolean;

  @Column({ default: false })
  reqResidencia!: boolean;

  @Column({ default: 'todo' })
  tipoAplicacion!: string;

  @Column({ nullable: true })
  categoria?: string;

  @Column('json', { nullable: true })
  productosIds?: number[] | null;
}