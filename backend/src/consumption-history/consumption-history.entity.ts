import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Student } from '../student/student.entity';
import { Order } from '../order/order.entity';
import { MealPlan } from '../meal-plan/meal-plan.entity';

export enum ConsumptionType {
  ORDER = 'order',
  MEAL_PLAN = 'meal_plan',
}

@Entity('consumption_history')
export class ConsumptionHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, (student) => student.consumptionHistory, { nullable: false })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @OneToOne(() => Order, (order) => order.consumptionHistory, { nullable: true })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => MealPlan, (plan) => plan.consumptionHistory, { nullable: true })
  @JoinColumn({ name: 'meal_plan_id' })
  mealPlan: MealPlan;

  @Column({ type: 'enum', enum: ConsumptionType })
  type: ConsumptionType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discount_amount: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  final_amount: number;

  @Column({ type: 'datetime' })
  consumed_at: Date;
}
