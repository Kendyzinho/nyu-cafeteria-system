import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItem } from './menu-item.entity';
import { Stock } from '../stock/stock.entity';
import { Category } from '../category/category.entity';
import { MenuItemService } from './menu-item.service';
import { MenuItemController } from './menu-item.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItem, Stock, Category])],
  controllers: [MenuItemController],
  providers: [MenuItemService],
  exports: [MenuItemService],
})
export class MenuItemModule {}
