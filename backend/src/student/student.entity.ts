import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../order/order.entity';
import { MealPlan } from '../meal-plan/meal-plan.entity';
import { ConsumptionHistory } from '../consumption-history/consumption-history.entity';

export enum StudentType {
  REGULAR = 'regular',
  RESIDENT = 'resident',
}

export enum AcademicStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum ResidenceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  external_id: string;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 150, unique: true })
  email: string;

  @Column({ type: 'enum', enum: StudentType })
  student_type: StudentType;

  @Column({ type: 'enum', enum: AcademicStatus, default: AcademicStatus.ACTIVE })
  academic_status: AcademicStatus;

  @Column({ type: 'enum', enum: ResidenceStatus, default: ResidenceStatus.INACTIVE })
  residence_status: ResidenceStatus;

  @OneToMany(() => Order, (order) => order.student)
  orders: Order[];

  @OneToMany(() => MealPlan, (plan) => plan.student)
  mealPlans: MealPlan[];

  @OneToMany(() => ConsumptionHistory, (ch) => ch.student)
  consumptionHistory: ConsumptionHistory[];
}
