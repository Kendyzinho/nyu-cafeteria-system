import { Module } from '@nestjs/common';
import { MenuController } from './menu/menu.controller';
import { OrdersController } from './orders/orders.controller';
import { MealPlansController } from './meal-plans/meal-plans.controller';
import { StockController } from './stock/stock.controller';
import { PromotionsController } from './promotions/promotions.controller';
import { UsersController } from './users/users.controller';
import { AuthController } from './auth/auth.controller';

@Module({
  controllers: [MenuController, OrdersController, MealPlansController, StockController, PromotionsController, UsersController, AuthController]
})
export class ControllersModule {}
