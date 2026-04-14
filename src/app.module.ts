import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ControllersModule } from './controllers/controllers.module';
import { DatabaseModule } from './database/database.module';
import { MenuService } from './providers/menu/menu.service';
import { OrdersService } from './providers/orders/orders.service';
import { MealPlansService } from './providers/meal-plans/meal-plans.service';
import { StockService } from './providers/stock/stock.service';
import { PromotionsService } from './providers/promotions/promotions.service';
import { UsersService } from './providers/users/users.service';
import { AuthService } from './providers/auth/auth.service';

@Module({
  imports: [ControllersModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService, MenuService, OrdersService, MealPlansService, StockService, PromotionsService, UsersService, AuthService],
})
export class AppModule {}