import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { MenuItemModule } from './menu-item/menu-item.module';
import { StockModule } from './stock/stock.module';
import { StudentModule } from './student/student.module';
import { PromotionModule } from './promotion/promotion.module';
import { OrderModule } from './order/order.module';
import { MealPlanModule } from './meal-plan/meal-plan.module';
import { PaymentModule } from './payment/payment.module';
import { ConsumptionHistoryModule } from './consumption-history/consumption-history.module';
import { IntegrationsModule } from './integrations/integrations.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // solo para desarrollo — cambiar a false en producción
      }),
    }),
    CategoryModule,
    MenuItemModule,
    StockModule,
    StudentModule,
    PromotionModule,
    OrderModule,
    MealPlanModule,
    PaymentModule,
    ConsumptionHistoryModule,
    IntegrationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
