import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanesCatalogoEntity } from 'src/database/entities/planes-catalogo.entity';
import type { IPostPlanComidaRequest } from 'src/controllers/planes-comida/dto/IPostPlanComidaRequest';
import type { IPutPlanComidaRequest } from 'src/controllers/planes-comida/dto/IPutPlanComidaRequest';

@Injectable()
export class PlanesComidaService {
  constructor(
    @InjectRepository(PlanesCatalogoEntity)
    private readonly planesRepository: Repository<PlanesCatalogoEntity>,
  ) {}

  public async getAll(): Promise<PlanesCatalogoEntity[]> {
    return await this.planesRepository.find();
  }

  public async getOne(id: number): Promise<PlanesCatalogoEntity | null> {
    return await this.planesRepository
      .createQueryBuilder('plan')
      .where('plan.id = :id', { id })
      .getOne();
  }

  public async create(data: IPostPlanComidaRequest): Promise<PlanesCatalogoEntity> {
    const item = new PlanesCatalogoEntity(data);
    return await this.planesRepository.save(item);
  }

  public async update(id: number, data: IPutPlanComidaRequest) {
    const result = await this.planesRepository.update(id, data);
    if (result.affected === 0) return undefined;
    return result;
  }

  public async delete(id: number) {
    const result = await this.planesRepository.delete(id);
    if (result.affected === 0) return undefined;
    return result;
  }
}
