import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from './menu-item.entity';
import { Stock } from '../stock/stock.entity';
import { Category } from '../category/category.entity';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@Injectable()
export class MenuItemService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepo: Repository<MenuItem>,
    @InjectRepository(Stock)
    private readonly stockRepo: Repository<Stock>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  findAll(date?: string, categoryId?: number) {
    const query = this.menuItemRepo
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.category', 'category')
      .leftJoinAndSelect('item.stock', 'stock');
    if (date) query.andWhere('item.available_date = :date', { date });
    if (categoryId) query.andWhere('category.id = :categoryId', { categoryId });
    return query.getMany();
  }

  async findOne(id: number) {
    const item = await this.menuItemRepo.findOne({
      where: { id },
      relations: ['category', 'stock'],
    });
    if (!item) throw new NotFoundException(`MenuItem #${id} not found`);
    return item;
  }

  async create(dto: CreateMenuItemDto) {
    const category = await this.categoryRepo.findOne({ where: { id: dto.category_id } });
    if (!category) throw new BadRequestException(`Category #${dto.category_id} not found`);

    const item = this.menuItemRepo.create({
      name: dto.name,
      description: dto.description,
      base_price: dto.base_price,
      available_date: dto.available_date,
      is_blocked: false,
      category,
    });
    const saved = await this.menuItemRepo.save(item);

    const stock = this.stockRepo.create({
      menuItem: saved,
      quantity: dto.initial_stock ?? 0,
      min_threshold: 0,
    });
    await this.stockRepo.save(stock);

    return this.findOne(saved.id);
  }

  async update(id: number, dto: UpdateMenuItemDto) {
    const item = await this.findOne(id);
    if (dto.category_id) {
      const category = await this.categoryRepo.findOne({ where: { id: dto.category_id } });
      if (!category) throw new BadRequestException(`Category #${dto.category_id} not found`);
      item.category = category;
    }
    if (dto.name !== undefined) item.name = dto.name;
    if (dto.description !== undefined) item.description = dto.description;
    if (dto.base_price !== undefined) item.base_price = dto.base_price;
    if (dto.available_date !== undefined) item.available_date = dto.available_date;
    return this.menuItemRepo.save(item);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    if (item.stock) {
      await this.stockRepo.remove(item.stock);
    }
    return this.menuItemRepo.remove(item);
  }
}
