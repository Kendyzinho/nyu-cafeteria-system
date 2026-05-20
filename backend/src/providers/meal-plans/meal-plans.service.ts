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

  public async getAll(): Promise<PlanesCatalogoEntity[]> {
    return await this.mealPlanRepository.find();
  }

  public async getOne(id: number): Promise<PlanesCatalogoEntity | null> {
    return await this.mealPlanRepository
      .createQueryBuilder('planes_catalogo')
      .where('planes_catalogo.id = :id', { id })
      .getOne();
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
