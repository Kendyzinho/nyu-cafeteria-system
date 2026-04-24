import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../order/order.entity';

export enum ProfileType {
  RESIDENT = 'resident',
  ACTIVE = 'active',
  ALL = 'all',
}

@Entity('promotions')
export class Promotion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'enum', enum: ProfileType })
  profile_type: ProfileType;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  discount_pct: number;

  @Column({ type: 'date' })
  valid_from: string;

  @Column({ type: 'date' })
  valid_to: string;

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => Order, (order) => order.promotion)
  orders: Order[];
}
