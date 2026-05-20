import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuController } from './menu/menu.controller';
import { OrdersController } from './orders/orders.controller';
import { MealPlansController } from './meal-plans/meal-plans.controller';
import { StockController } from './stock/stock.controller';
import { PromotionsController } from './promotions/promotions.controller';
import { UsersController } from './users/users.controller';
import { AuthController } from './auth/auth.controller';
import { ComidaEntity } from 'src/database/entities/comida.entity';
import { PedidoEntity } from 'src/database/entities/pedido.entity';
import { DetallePedidoEntity } from 'src/database/entities/detalle-pedido.entity';
import { PlanesCatalogoEntity } from 'src/database/entities/planes-catalogo.entity';
import { InsumosEntity } from 'src/database/entities/insumos.entity';
import { RecetaComidaEntity } from 'src/database/entities/receta-comida.entity';
import { PromocionEntity } from 'src/database/entities/promocion.entity';
import { SuscripcionAlumnoEntity } from 'src/database/entities/suscripcion-alumno.entity';
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
      ComidaEntity,
      PedidoEntity,
      DetallePedidoEntity,
      PlanesCatalogoEntity,
      InsumosEntity,
      RecetaComidaEntity,
      PromocionEntity,
      SuscripcionAlumnoEntity,
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
