import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'receta_comida' })
export class RecetaComidaEntity {
  constructor(data?: Partial<RecetaComidaEntity>) {
    if (data) Object.assign(this, data);
  }

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'comida_id' })
  comida_id!: number;

  @Column({ name: 'insumo_id' })
  insumo_id!: number;

  @Column('decimal', { precision: 10, scale: 3, name: 'cantidad_requerida' })
  cantidad_requerida!: number;
}
