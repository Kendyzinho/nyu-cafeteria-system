import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuController } from './menu/menu.controller';
import { OrdersController } from './orders/orders.controller';
import { MealPlansController } from './meal-plans/meal-plans.controller';
import { StockController } from './stock/stock.controller';
import { PromotionsController } from './promotions/promotions.controller';
import { UsersController } from './users/users.controller';
import { AuthController } from './auth/auth.controller';
import { MenuEntity } from 'src/database/entities/menu.entity';
import { OrderEntity } from 'src/database/entities/order.entity';
import { MealPlanEntity } from 'src/database/entities/meal-plan.entity';
import { StockEntity } from 'src/database/entities/stock.entity';
import { PromotionEntity } from 'src/database/entities/promotion.entity';
import { UserEntity } from 'src/database/entities/user.entity';
import { MenuService } from 'src/providers/menu/menu.service';
import { OrdersService } from 'src/providers/orders/orders.service';
import { MealPlansService } from 'src/providers/meal-plans/meal-plans.service';
import { StockService } from 'src/providers/stock/stock.service';
import { PromotionsService } from 'src/providers/promotions/promotions.service';
import { UsersService } from 'src/providers/users/users.service';
import { AuthService } from 'src/providers/auth/auth.service';

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