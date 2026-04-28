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
  descuento!: number; // Porcentaje de descuento

  @Column()
  fechaInicio!: Date;

  @Column()
  fechaFin!: Date;

  @Column({ default: true })
  activa!: boolean;

  // === Requisitos del estudiante para calificar ===

  @Column({ default: false })
  reqMatricula!: boolean; // ¿Requiere matrícula activa?

  @Column({ default: false })
  reqResidencia!: boolean; // ¿Requiere residencia activa?

  // === A qué productos aplica ===

  @Column({ default: 'todo' })
  tipoAplicacion!: string; // 'producto' | 'categoria' | 'todo'

  @Column({ type: 'varchar', nullable: true })
  categoria?: string | null; // Categoría del menú (cuando tipoAplicacion = 'categoria')

  @Column('json', { nullable: true })
  productosIds?: number[] | null; // IDs de productos (cuando tipoAplicacion = 'producto')
}