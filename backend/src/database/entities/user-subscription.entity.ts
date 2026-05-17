import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_subscription' })
export class UserSubscriptionEntity {
  constructor(data?: Partial<UserSubscriptionEntity>) {
    if (data) Object.assign(this, data);
  }

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  planId!: number;

  @Column({ type: 'date' })
  fechaInicio!: Date;

  @Column({ type: 'date' })
  fechaFin!: Date;

  @Column({ default: 0 })
  consumosUsados!: number;

  @Column({ default: true })
  activa!: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  descuentoAplicado!: number;
}
