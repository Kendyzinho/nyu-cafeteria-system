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
      cantidad: item.stock_actual,
      umbralMinimo: 5,
      ultimaActualizacion: new Date(),
      nombre: item.nombre,
      categoria: item.categoria
    }));
  }

  public async getOne(id: number): Promise<IStockWithMenu | null> {
    const item = await this.menuRepository.findOne({ where: { id } });
    if (!item) return null;
    return {
      id: item.id,
      menuItemId: item.id,
      cantidad: item.stock_actual,
      umbralMinimo: 5,
      ultimaActualizacion: new Date(),
      nombre: item.nombre,
      categoria: item.categoria,
    };
  }

  public async create(data: IPostStockRequest): Promise<any> {
    const item = this.menuRepository.create({
      nombre: data.nombre,
      stock_actual: data.stock_Actual,
    });
    const saved = await this.menuRepository.save(item);
    return {
      id: saved.id,
      menuItemId: saved.id,
      cantidad: saved.stock_actual,
      umbralMinimo: data.umbral_minimo,
      ultimaActualizacion: new Date(),
    };
  }

  public async update(id: number, data: IPutStockRequest) {
    const item = await this.menuRepository.findOne({ where: { id } });
    if (!item) return undefined;
    if (data.cantidad !== undefined) {
      item.stock_actual = data.cantidad;
    }
    await this.menuRepository.save(item);
    return { affected: 1 };
  }

  public async delete(id: number) {
    const item = await this.menuRepository.findOne({ where: { id } });
    if (!item) return undefined;
    item.stock_actual = 0;
    await this.menuRepository.save(item);
    return { affected: 1 };
  }
}
