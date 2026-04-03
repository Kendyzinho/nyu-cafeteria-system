import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '../category/category.entity';
import { Stock } from '../stock/stock.entity';
import { OrderItem } from '../order-item/order-item.entity';

@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 255, nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  base_price: number;

  @Column({ type: 'date' })
  available_date: string;

  @Column({ default: false })
  is_blocked: boolean;

  @ManyToOne(() => Category, (cat) => cat.menuItems, { nullable: false })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToOne(() => Stock, (stock) => stock.menuItem, { cascade: true })
  stock: Stock;

  @OneToMany(() => OrderItem, (oi) => oi.menuItem)
  orderItems: OrderItem[];
}
