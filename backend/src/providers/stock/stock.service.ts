import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockEntity } from 'src/database/entities/stock.entity';
import type { IPostStockRequest } from 'src/controllers/stock/dto/IPostStockRequest';
import type { IPutStockRequest } from 'src/controllers/stock/dto/IPutStockRequest';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(StockEntity)
    private readonly stockRepository: Repository<StockEntity>,
  ) {}

  public async getAll(): Promise<StockEntity[]> {
    return await this.stockRepository.find();
  }

  public async getOne(id: number): Promise<StockEntity | null> {
    return await this.stockRepository
      .createQueryBuilder('stock')
      .where('stock.id = :id', { id })
      .getOne();
  }

  public async create(data: IPostStockRequest): Promise<StockEntity> {
    const item = this.stockRepository.create({
      ...data,
      ultimaActualizacion: new Date(),
    });
    return await this.stockRepository.save(item);
  }

  public async update(id: number, data: IPutStockRequest) {
    const result = await this.stockRepository.update(id, {
      ...data,
      ultimaActualizacion: new Date(),
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