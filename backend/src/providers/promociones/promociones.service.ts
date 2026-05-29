import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PromocionEntity } from 'src/database/entities/promocion.entity';
import type { IPostPromocionRequest } from 'src/controllers/promociones/dto/IPostPromocionRequest';
import type { IPutPromocionRequest } from 'src/controllers/promociones/dto/IPutPromocionRequest';

@Injectable()
export class PromocionesService {
  constructor(
    @InjectRepository(PromocionEntity)
    private readonly promocionRepository: Repository<PromocionEntity>,
  ) {}

  public async getAll(): Promise<PromocionEntity[]> {
    return await this.promocionRepository.find();
  }

  public async getOne(id: number): Promise<PromocionEntity | null> {
    return await this.promocionRepository
      .createQueryBuilder('promocion')
      .where('promocion.id = :id', { id })
      .getOne();
  }

  public async create(data: IPostPromocionRequest): Promise<PromocionEntity> {
    const item = this.promocionRepository.create(data);
    return await this.promocionRepository.save(item);
  }

  public async update(id: number, data: IPutPromocionRequest) {
    const result = await this.promocionRepository.update(id, data);
    if (result.affected === 0) return undefined;
    return result;
  }

  public async delete(id: number) {
    const result = await this.promocionRepository.delete(id);
    if (result.affected === 0) return undefined;
    return result;
  }
}
