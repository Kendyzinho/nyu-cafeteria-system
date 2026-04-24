import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'menu' })
export class MenuEntity {
  constructor(data?: Partial<MenuEntity>) {
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

  @Column({ default: true })
  disponible!: boolean;

  @Column({ default: 0 })
  stockActual!: number;

  @Column()
  fechaDisponible!: Date;

  @Column({ nullable: true })
  image!: string;
}