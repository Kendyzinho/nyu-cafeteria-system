import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderItem } from '../order-item/order-item.entity';
import { ConsumptionHistory } from '../consumption-history/consumption-history.entity';
import { Payment } from '../payment/payment.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { StudentModule } from '../student/student.module';
import { MenuItemModule } from '../menu-item/menu-item.module';
import { StockModule } from '../stock/stock.module';
import { PromotionModule } from '../promotion/promotion.module';
import { IntegrationsModule } from '../integrations/integrations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, ConsumptionHistory, Payment]),
    StudentModule,
    MenuItemModule,
    StockModule,
    PromotionModule,
    IntegrationsModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
