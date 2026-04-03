import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from './stock.entity';
import { MenuItem } from '../menu-item/menu-item.entity';
import { UpdateStockDto } from './dto/update-stock.dto';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepo: Repository<Stock>,
    @InjectRepository(MenuItem)
    private readonly menuItemRepo: Repository<MenuItem>,
  ) {}

  async findByMenuItem(menuItemId: number) {
    const stock = await this.stockRepo.findOne({
      where: { menuItem: { id: menuItemId } },
      relations: ['menuItem'],
    });
    if (!stock) throw new NotFoundException(`Stock for MenuItem #${menuItemId} not found`);
    return stock;
  }

  async updateQuantity(menuItemId: number, dto: UpdateStockDto) {
    const stock = await this.findByMenuItem(menuItemId);
    stock.quantity = dto.quantity;
    stock.menuItem.is_blocked = dto.quantity <= stock.min_threshold;
    await this.menuItemRepo.save(stock.menuItem);
    return this.stockRepo.save(stock);
  }

  async decrementStock(menuItemId: number, quantity: number) {
    const stock = await this.findByMenuItem(menuItemId);
    stock.quantity = Math.max(0, stock.quantity - quantity);
    stock.menuItem.is_blocked = stock.quantity <= stock.min_threshold;
    await this.menuItemRepo.save(stock.menuItem);
    return this.stockRepo.save(stock);
  }
}
