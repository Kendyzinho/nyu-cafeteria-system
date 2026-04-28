import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { UserEntity } from './entities/user.entity';
import { MenuEntity } from './entities/menu.entity';
import { OrderEntity } from './entities/order.entity';
import { MealPlanEntity } from './entities/meal-plan.entity';
import { StockEntity } from './entities/stock.entity';
import { PromotionEntity } from './entities/promotion.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [
          UserEntity,
          MenuEntity,
          OrderEntity,
          MealPlanEntity,
          StockEntity,
          PromotionEntity,
        ],
        synchronize: true,
        autoLoadEntities: true,
        retryAttempts: 10,
        retryDelay: 3000,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
  providers: [],
})
export class DatabaseModule {}