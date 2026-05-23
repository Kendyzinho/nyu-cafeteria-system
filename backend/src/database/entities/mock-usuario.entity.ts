import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'mock_usuario' })
export class MockUsuarioEntity {
  constructor(data?: Partial<MockUsuarioEntity>) {
    if (data) Object.assign(this, data);
  }

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  get apellido(): string {
    return '';
  }
  set apellido(val: string) {}

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  tipo!: string;

  @Column({ type: 'tinyint', default: 1 })
  activo!: boolean;

  @Column({ type: 'tinyint', name: 'es_residente', default: 0 })
  es_residente!: boolean;
}
