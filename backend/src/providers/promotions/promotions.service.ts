import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PromocionEntity } from 'src/database/entities/promocion.entity';
import type { IPostPromotionRequest } from 'src/controllers/promotions/dto/IPostPromotionRequest';
import type { IPutPromotionRequest } from 'src/controllers/promotions/dto/IPutPromotionRequest';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(PromocionEntity)
    private readonly promotionRepository: Repository<PromocionEntity>,
  ) {}

  public async getAll(): Promise<PromocionEntity[]> {
    return await this.promotionRepository.find();
  }

  public async getOne(id: number): Promise<PromocionEntity | null> {
    return await this.promotionRepository
      .createQueryBuilder('promocion')
      .where('promocion.id = :id', { id })
      .getOne();
  }

  public async create(data: IPostPromotionRequest): Promise<PromocionEntity> {
    const item = this.promotionRepository.create(data);
    return await this.promotionRepository.save(item);
  }

  public async update(id: number, data: IPutPromotionRequest) {
    const result = await this.promotionRepository.update(id, data);
    if (result.affected === 0) return undefined;
    return result;
  }

  public async delete(id: number) {
    const result = await this.promotionRepository.delete(id);
    if (result.affected === 0) return undefined;
    return result;
  }
}
