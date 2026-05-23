import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ComidaEntity } from './comida.entity';
import { InsumosEntity } from './insumos.entity';

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

  @Column({ name: 'cantidad_requerida' })
  cantidadRequerida!: number;

  @ManyToOne(() => ComidaEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'comida_id' })
  comida!: ComidaEntity;

  @ManyToOne(() => InsumosEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'insumo_id' })
  insumo!: InsumosEntity;
}
