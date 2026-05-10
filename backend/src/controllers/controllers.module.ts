import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuController } from './menu/menu.controller';
import { OrdersController } from './orders/orders.controller';
import { MealPlansController } from './meal-plans/meal-plans.controller';
import { StockController } from './stock/stock.controller';
import { PromotionsController } from './promotions/promotions.controller';
import { UsersController } from './users/users.controller';
import { AuthController } from './auth/auth.controller';
import { MenuEntity } from '../database/entities/menu.entity';
import { OrderEntity } from '../database/entities/order.entity';
import { MealPlanEntity } from '../database/entities/meal-plan.entity';
import { StockEntity } from '../database/entities/stock.entity';
import { PromotionEntity } from '../database/entities/promotion.entity';
import { UserEntity } from '../database/entities/user.entity';
import { MenuService } from '../providers/menu/menu.service';
import { OrdersService } from '../providers/orders/orders.service';
import { MealPlansService } from '../providers/meal-plans/meal-plans.service';
import { StockService } from '../providers/stock/stock.service';
import { PromotionsService } from '../providers/promotions/promotions.service';
import { UsersService } from '../providers/users/users.service';
import { AuthService } from '../providers/auth/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MenuEntity,
      OrderEntity,
      MealPlanEntity,
      StockEntity,
      PromotionEntity,
      UserEntity,
    ]),
  ],
  controllers: [
    MenuController,
    OrdersController,
    MealPlansController,
    StockController,
    PromotionsController,
    UsersController,
    AuthController,
  ],
  providers: [
  MenuService,
  OrdersService,
  MealPlansService,
  StockService,
  PromotionsService,
  UsersService,
  AuthService,
  ],
})
export class ControllersModule {}