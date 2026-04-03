import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum PaymentReferenceType {
  ORDER = 'order',
  MEAL_PLAN = 'meal_plan',
}

export enum PaymentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: PaymentReferenceType })
  reference_type: PaymentReferenceType;

  @Column({ type: 'int' })
  reference_id: number;

  @Column({ length: 100, nullable: true })
  external_ref: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ type: 'datetime', nullable: true })
  processed_at: Date;
}
