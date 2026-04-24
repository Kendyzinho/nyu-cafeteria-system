import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'meal_plan' })
export class MealPlanEntity {
  constructor(data?: Partial<MealPlanEntity>) {
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
  tipo!: string;

  @Column({ default: true })
  activo!: boolean;
}