import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MenuItem } from '../menu-item/menu-item.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 255, nullable: true })
  description: string;

  @OneToMany(() => MenuItem, (item) => item.category)
  menuItems: MenuItem[];
}
