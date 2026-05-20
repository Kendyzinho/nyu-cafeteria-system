import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'comida' })
export class ComidaEntity {
  constructor(data?: Partial<ComidaEntity>) {
    if (data) Object.assign(this, data);
  }

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column()
  descripcion!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio!: number;

  @Column()
  categoria!: string;

  @Column({ name: 'imagen_url', nullable: true })
  imagen_url!: string;

  @Column({ default: 0 })
  stock_actual!: number;

  @Column({ default: true })
  disponible!: boolean;

  @Column({ name: 'fecha_disponible', nullable: true })
  fecha_disponible!: Date;
}
