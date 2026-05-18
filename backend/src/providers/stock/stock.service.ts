import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockEntity } from 'src/database/entities/stock.entity';
import { MenuEntity } from 'src/database/entities/menu.entity';
import type { IPostStockRequest } from 'src/controllers/stock/dto/IPostStockRequest';
import type { IPutStockRequest } from 'src/controllers/stock/dto/IPutStockRequest';

export interface IStockWithMenu {
  id: number;
  menuItemId: number;
  cantidad: number;
  umbralMinimo: number;
  ultimaActualizacion: Date;
  nombre: string | null;
  categoria: string | null;
}

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(StockEntity)
    private readonly stockRepository: Repository<StockEntity>,
  ) {}

  public async getAll(): Promise<IStockWithMenu[]> {
    return await this.stockRepository
      .createQueryBuilder('stock')
      .leftJoin(MenuEntity, 'menu', 'menu.id = stock.menuItemId')
      .select('stock.id', 'id')
      .addSelect('stock.menuItemId', 'menuItemId')
      .addSelect('stock.cantidad', 'cantidad')
      .addSelect('stock.umbralMinimo', 'umbralMinimo')
      .addSelect('stock.ultimaActualizacion', 'ultimaActualizacion')
      .addSelect('menu.nombre', 'nombre')
      .addSelect('menu.categoria', 'categoria')
      .getRawMany<IStockWithMenu>();
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