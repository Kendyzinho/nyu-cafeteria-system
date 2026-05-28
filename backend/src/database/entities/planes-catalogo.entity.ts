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

  @Column('text')
  descripcion!: string;

  @Column('decimal', { name: 'precio_mensual', precision: 10, scale: 2 })
  precio_mensual!: number;
  

  get precio(): number {
    return this.precio_mensual;
  }
  set precio(val: number) {
    this.precio_mensual = val;
  }

  // tipo derivado del nombre para compatibilidad con el frontend
  tipo?: string;

  @Column({ type: 'tinyint', default: 1 })
  activo!: boolean;

  // Lógica de negocio derivada (no se guarda en BD)
  get reqMatricula(): boolean {
    return true; // Todos los planes requieren matrícula activa
  }

  get reqResidencia(): boolean {
    return this.nombre?.toLowerCase().includes('residente') ?? false;
  }
}
