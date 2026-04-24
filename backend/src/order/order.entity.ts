import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Student } from '../student/student.entity';
import { Promotion } from '../promotion/promotion.entity';
import { OrderItem } from '../order-item/order-item.entity';
import { ConsumptionHistory } from '../consumption-history/consumption-history.entity';

export enum OrderStatus {
  PENDING = 'pending',
  PAYMENT_PENDING = 'payment_pending',
  CONFIRMED = 'confirmed',
  READY = 'ready',
  DELIVERED = 'delivered',
}

export enum PaymentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, (student) => student.orders, { nullable: false })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ type: 'datetime' })
  pickup_time: Date;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_price: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  discount_applied: number | null;

  @ManyToOne(() => Promotion, (promo) => promo.orders, { nullable: true })
  @JoinColumn({ name: 'promotion_id' })
  promotion: Promotion | null;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  payment_status: PaymentStatus;

  @OneToMany(() => OrderItem, (oi) => oi.order, { cascade: true })
  items: OrderItem[];

  @OneToOne(() => ConsumptionHistory, (ch) => ch.order)
  consumptionHistory: ConsumptionHistory;
}
