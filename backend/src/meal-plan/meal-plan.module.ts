import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealPlan } from './meal-plan.entity';
import { Payment } from '../payment/payment.entity';
import { ConsumptionHistory } from '../consumption-history/consumption-history.entity';
import { MealPlanService } from './meal-plan.service';
import { MealPlanController } from './meal-plan.controller';
import { StudentModule } from '../student/student.module';
import { IntegrationsModule } from '../integrations/integrations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MealPlan, Payment, ConsumptionHistory]),
    StudentModule,
    IntegrationsModule,
  ],
  controllers: [MealPlanController],
  providers: [MealPlanService],
  exports: [MealPlanService],
})
export class MealPlanModule {}
