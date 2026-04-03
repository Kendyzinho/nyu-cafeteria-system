import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsumptionHistory } from './consumption-history.entity';
import { ConsumptionHistoryService } from './consumption-history.service';
import { ConsumptionHistoryController } from './consumption-history.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ConsumptionHistory])],
  controllers: [ConsumptionHistoryController],
  providers: [ConsumptionHistoryService],
  exports: [ConsumptionHistoryService],
})
export class ConsumptionHistoryModule {}
