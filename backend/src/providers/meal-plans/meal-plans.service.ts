import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanesCatalogoEntity } from 'src/database/entities/planes-catalogo.entity';
import type { IPostMealPlanRequest } from 'src/controllers/meal-plans/dto/IPostMealPlanRequest';
import type { IPutMealPlanRequest } from 'src/controllers/meal-plans/dto/IPutMealPlanRequest';

@Injectable()
export class MealPlansService {
  constructor(
    @InjectRepository(PlanesCatalogoEntity)
    private readonly mealPlanRepository: Repository<PlanesCatalogoEntity>,
  ) {}

  private mapToDto(plan: PlanesCatalogoEntity) {
    return {
      ...plan,
      tipo: plan.nombre,
      precio: plan.precio_mensual
    };
  }

  public async getAll(): Promise<any[]> {
    const plans = await this.mealPlanRepository.find();
    return plans.map(p => this.mapToDto(p));
  }

  public async getOne(id: number): Promise<any | null> {
    const plan = await this.mealPlanRepository
      .createQueryBuilder('mealPlan')
      .where('mealPlan.id = :id', { id })
      .getOne();
    return plan ? this.mapToDto(plan) : null;
  }

  public async create(data: IPostMealPlanRequest): Promise<PlanesCatalogoEntity> {
    const item = new PlanesCatalogoEntity(data);
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