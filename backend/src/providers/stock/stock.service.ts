import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComidaEntity } from 'src/database/entities/comida.entity';
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
    @InjectRepository(ComidaEntity)
    private readonly menuRepository: Repository<ComidaEntity>,
  ) {}

  public async getAll(): Promise<IStockWithMenu[]> {
    const items = await this.menuRepository.find();
    return items.map(item => ({
      id: item.id,
      menuItemId: item.id,
      cantidad: item.stockActual,
      umbralMinimo: 5, // default threshold
      ultimaActualizacion: new Date(),
      nombre: item.nombre,
      categoria: item.categoria
    }));
  }

  public async getOne(id: number): Promise<any | null> {
    const item = await this.menuRepository.findOne({ where: { id } });
    if (!item) return null;
    return {
      id: item.id,
      menuItemId: item.id,
      cantidad: item.stockActual,
      umbralMinimo: 5,
      ultimaActualizacion: new Date(),
    };
  }

  public async create(data: IPostStockRequest): Promise<any> {
    const item = await this.menuRepository.findOne({ where: { id: data.menuItemId } });
    if (item) {
      item.stockActual = data.cantidad;
      await this.menuRepository.save(item);
    }
    return {
      id: data.menuItemId,
      menuItemId: data.menuItemId,
      cantidad: data.cantidad,
      umbralMinimo: data.umbralMinimo,
      ultimaActualizacion: new Date(),
    };
  }

  public async update(id: number, data: IPutStockRequest) {
    const item = await this.menuRepository.findOne({ where: { id } });
    if (!item) return undefined;
    if (data.cantidad !== undefined) {
      item.stockActual = data.cantidad;
    }
    await this.menuRepository.save(item);
    return { affected: 1 };
  }

  public async delete(id: number) {
    const item = await this.menuRepository.findOne({ where: { id } });
    if (!item) return undefined;
    item.stockActual = 0;
    await this.menuRepository.save(item);
    return { affected: 1 };
  }
}