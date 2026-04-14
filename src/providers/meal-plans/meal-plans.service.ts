import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MealPlanEntity } from 'src/database/entities/meal-plan.entity';
import type { IPostMealPlanRequest } from 'src/controllers/meal-plans/dto/IPostMealPlanRequest';
import type { IPutMealPlanRequest } from 'src/controllers/meal-plans/dto/IPutMealPlanRequest';

@Injectable()
export class MealPlansService {
  constructor(
    @InjectRepository(MealPlanEntity)
    private readonly mealPlanRepository: Repository<MealPlanEntity>,
  ) {}

  public async getAll(): Promise<MealPlanEntity[]> {
    return await this.mealPlanRepository.find();
  }

  public async getOne(id: number): Promise<MealPlanEntity | null> {
    return await this.mealPlanRepository
      .createQueryBuilder('mealPlan')
      .where('mealPlan.id = :id', { id })
      .getOne();
  }

  public async create(data: IPostMealPlanRequest): Promise<MealPlanEntity> {
    const item = this.mealPlanRepository.create(data);
    return await this.mealPlanRepository.save(item);
  }

  public async update(id: number, data: IPutMealPlanRequest) {
    const result = await this.mealPlanRepository.update(id, data);
    if (result.affected === 0) return undefined;
    return result;
  }

  public async delete(id: number) {
    const result = await this.mealPlanRepository.delete(id);
    if (result.affected === 0) return undefined;
    return result;
  }
}