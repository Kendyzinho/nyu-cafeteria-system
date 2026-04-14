import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'order' })
export class OrderEntity {
  constructor(data?: Partial<OrderEntity>) {
    if (data) Object.assign(this, data);
  }

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  usuarioId!: number;

  @Column('json')
  items!: any[];

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total!: number;

  @Column({ default: 'pendiente' })
  estado!: string;

  @Column()
  fechaCreacion!: Date;
}