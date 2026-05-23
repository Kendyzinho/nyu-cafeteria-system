import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'insumos' })
export class InsumosEntity {
  constructor(data?: Partial<InsumosEntity>) {
    if (data) Object.assign(this, data);
  }

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column({ name: 'unidad_medida' })
  unidad_medida!: string;

  @Column({ name: 'stock_Actual', default: 0 })
  stock_Actual!: number;

  @Column({ name: 'umbral_minimo', default: 0 })
  umbral_minimo!: number;

  @Column({ name: 'ultima_actualizacion' })
  ultima_actualizacion!: Date;
}
