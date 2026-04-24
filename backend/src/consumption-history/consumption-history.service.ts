import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConsumptionHistory } from './consumption-history.entity';

@Injectable()
export class ConsumptionHistoryService {
  constructor(
    @InjectRepository(ConsumptionHistory)
    private readonly consumptionRepo: Repository<ConsumptionHistory>,
  ) {}

  findByStudent(studentId: number) {
    return this.consumptionRepo.find({
      where: { student: { id: studentId } },
      relations: ['order', 'order.items', 'order.items.menuItem', 'order.promotion', 'mealPlan'],
      order: { consumed_at: 'DESC' },
    });
  }

  async findOne(id: number) {
    const ch = await this.consumptionRepo.findOne({
      where: { id },
      relations: ['student', 'order', 'order.items', 'order.items.menuItem', 'order.promotion', 'mealPlan'],
    });
    if (!ch) throw new NotFoundException(`ConsumptionHistory #${id} not found`);
    return ch;
  }
}
