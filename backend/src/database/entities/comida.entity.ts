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

  @Column('text')
  descripcion!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio!: number;

  @Column()
  categoria!: string;

  @Column({ default: true })
  disponible!: boolean;

  @Column({ name: 'stock_actual', default: 0 })
  stock_actual!: number;

  @Column({ name: 'imagen_url', nullable: true })
  imagen_url!: string;

  get stockActual(): number {
    return this.stock_actual;
  }
  set stockActual(val: number) {
    this.stock_actual = val;
  }
}
