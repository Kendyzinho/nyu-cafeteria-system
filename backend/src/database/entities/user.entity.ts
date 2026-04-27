import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity {
  constructor(data?: Partial<UserEntity>) {
    if (data) Object.assign(this, data);
  }

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column()
  apellido!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  tipo!: string; // 'admin' | 'student'

  @Column({ default: false })
  matriculaActiva!: boolean; // Integración con Sistema de Matrícula y Gestión Académica

  @Column({ default: false })
  residenciaActiva!: boolean; // Integración con Sistema de Alojamiento Universitario
}