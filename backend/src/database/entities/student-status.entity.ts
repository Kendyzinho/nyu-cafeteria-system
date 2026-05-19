import { Column, Entity, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { MealPlanEntity } from './meal-plan.entity';

@Entity({ name: 'student_status' })
export class StudentStatusEntity {
  constructor(data?: Partial<StudentStatusEntity>) {
    if (data) Object.assign(this, data);
  }

  @PrimaryColumn()
  usuarioId!: number;

  @Column({ default: false })
  matriculaActiva!: boolean;

  @Column({ default: false })
  residenciaActiva!: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  ultimaActualizacion!: Date;

  @Column({ nullable: true })
  planActivoId?: number | null;

  @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuarioId' })
  usuario!: UserEntity;

  @OneToOne(() => MealPlanEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'planActivoId' })
  planActivo?: MealPlanEntity | null;
}
