import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Student } from '../student/student.entity';
import { ConsumptionHistory } from '../consumption-history/consumption-history.entity';

export enum PlanType {
  BASIC = 'basic',
  STANDARD = 'standard',
  PREMIUM = 'premium',
}

export enum MealPlanStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

@Entity('meal_plans')
export class MealPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, (student) => student.mealPlans, { nullable: false })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ type: 'enum', enum: PlanType })
  plan_type: PlanType;

  @Column({ type: 'int' })
  month: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'enum', enum: MealPlanStatus, default: MealPlanStatus.PENDING })
  status: MealPlanStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int' })
  daily_credits: number;

  @Column({ type: 'int' })
  credits_remaining: number;

  @Column({ type: 'datetime', nullable: true })
  activated_at: Date;

  @Column({ type: 'datetime', nullable: true })
  expires_at: Date;

  @OneToMany(() => ConsumptionHistory, (ch) => ch.mealPlan)
  consumptionHistory: ConsumptionHistory[];
}
