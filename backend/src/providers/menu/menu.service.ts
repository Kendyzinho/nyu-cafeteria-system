import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComidaEntity } from 'src/database/entities/comida.entity';
import type { IPutMenuRequest } from 'src/controllers/menu/dto/IPutMenuRequest';
import type { IPostMenuRequest } from 'src/controllers/menu/dto/IPostMenuRequest';

@Injectable()
export class MenuService {

  constructor(
    @InjectRepository(ComidaEntity)
    private readonly menuRepository: Repository<ComidaEntity>,
  ) {}

  private toResponse(item: ComidaEntity) {
    return {
      id: item.id,
      name: item.nombre,
      category: item.categoria,
      description: item.descripcion,
      price: Number(item.precio),
      studentPrice: +(Number(item.precio) * 0.75).toFixed(0),
      image: item.imagen_url ?? '',
      isAvailable: item.disponible,
      stock: item.stock_actual,
    };
  }

  public async getAll() {
    const items = await this.menuRepository.find();
    return items.map(item => this.toResponse(item));
  }

  public async getOne(id: number) {
    const item = await this.menuRepository
      .createQueryBuilder('comida')
      .where('comida.id = :id', { id })
      .getOne();
    if (!item) return null;
    return this.toResponse(item);
  }

  public async create(data: IPostMenuRequest): Promise<ComidaEntity> {
    const item = this.menuRepository.create(data);
    return await this.menuRepository.save(item);
  }

  public async update(id: number, data: IPutMenuRequest) {
    const result = await this.menuRepository.update(id, data);
    if (result.affected === 0) return undefined;
    return result;
  }

  public async delete(id: number) {
    const result = await this.menuRepository.delete(id);
    if (result.affected === 0) return undefined;
    return result;
  }
}
