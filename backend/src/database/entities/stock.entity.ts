import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'stock' })
export class StockEntity {
  constructor(data?: Partial<StockEntity>) {
    if (data) Object.assign(this, data);
  }

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  menuItemId!: number;

  @Column({ default: 0 })
  cantidad!: number;

  @Column({ default: 0 })
  umbralMinimo!: number;

  @Column()
  ultimaActualizacion!: Date;
}