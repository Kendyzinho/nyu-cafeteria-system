import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'insumo' })
export class InsumoEntity {
  constructor(data?: Partial<InsumoEntity>) {
    if (data) Object.assign(this, data);
  }

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column({ name: 'unidad_medida' })
  unidadMedida!: string;

  @Column({ name: 'stock_Actual', default: 0 })
  stockActual!: number;

  @Column({ name: 'umbral_minimo', default: 5 })
  umbralMinimo!: number;

  @Column({ name: 'ultima_actualizacion', type: 'date' })
  ultimaActualizacion!: Date;
}
