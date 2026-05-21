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


  @Column({ name: 'imagen_url', nullable: true })
  imagen_url!: string;

  stock_actual!: number;

  get stockActual(): number {
    return this.stock_actual;
  }
  set stockActual(val: number) {
    this.stock_actual = val;
  }

  @Column({ name: 'imagen_url', nullable: true })
  imagen_url!: string;

  get image(): string {
    return this.imagen_url || '';
  }
  set image(val: string) {
    this.imagen_url = val;
  }

}
