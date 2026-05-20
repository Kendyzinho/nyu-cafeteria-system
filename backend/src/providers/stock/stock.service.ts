import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InsumosEntity } from 'src/database/entities/insumos.entity';
import type { IPostStockRequest } from 'src/controllers/stock/dto/IPostStockRequest';
import type { IPutStockRequest } from 'src/controllers/stock/dto/IPutStockRequest';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(InsumosEntity)
    private readonly stockRepository: Repository<InsumosEntity>,
  ) {}

  public async getAll(): Promise<InsumosEntity[]> {
    return await this.stockRepository.find();
  }

  public async getOne(id: number): Promise<InsumosEntity | null> {
    return await this.stockRepository
      .createQueryBuilder('insumos')
      .where('insumos.id = :id', { id })
      .getOne();
  }

  public async create(data: IPostStockRequest): Promise<InsumosEntity> {
    const item = this.stockRepository.create({
      ...data,
      ultima_actualizacion: new Date(),
    });
    return await this.stockRepository.save(item);
  }

  public async update(id: number, data: IPutStockRequest) {
    const result = await this.stockRepository.update(id, {
      ...data,
      ultima_actualizacion: new Date(),
    });
    if (result.affected === 0) return undefined;
    return result;
  }

  public async delete(id: number) {
    const result = await this.stockRepository.delete(id);
    if (result.affected === 0) return undefined;
    return result;
  }
}
