import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'planes_catalogo' })
export class PlanesCatalogoEntity {
  constructor(data?: Partial<PlanesCatalogoEntity>) {
    if (data) Object.assign(this, data);
  }

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column()
  descripcion!: string;

  @Column('decimal', { precision: 10, scale: 2, name: 'precio_mensual' })
  precio_mensual!: number;

  @Column({ default: true })
  activo!: boolean;
}
