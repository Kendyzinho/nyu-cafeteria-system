import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComidaEntity } from 'src/database/entities/comida.entity';
import type { IPutMenuRequest } from 'src/controllers/menu/dto/IPutMenuRequest';
import type { IPostMenuRequest } from 'src/controllers/menu/dto/IPostMenuRequest';

@Injectable() // marca la clase como un provider inyectable
export class MenuService {

  constructor(
    @InjectRepository(ComidaEntity)
    private readonly menuRepository: Repository<ComidaEntity>,
  ) {}

  // mapea la entidad al formato que espera el frontend
  private async toResponse(item: ComidaEntity) {
    const isActuallyAvailable = item.disponible && item.stockActual > 0;

    return {
      id: item.id,
      name: item.nombre,
      category: item.categoria,
      description: item.descripcion,
      price: Number(item.precio),
      studentPrice: +(Number(item.precio) * 0.75).toFixed(0),
      image: item.image ?? '',
      isAvailable: isActuallyAvailable,
      stock: item.stockActual
    };
  }

  // obtiene todos los ítems del menú y los mapea al formato del frontend
  public async getAll() {
    const items = await this.menuRepository.find();
    return await Promise.all(items.map(item => this.toResponse(item)));
  }

  // obtiene un ítem por id
  public async getOne(id: number) {
    const item = await this.menuRepository
      .createQueryBuilder('menu')
      .where('menu.id = :id', { id })
      .getOne();
    if (!item) return null;
    return await this.toResponse(item);
  }

  // crea un nuevo ítem en la base de datos
  public async create(data: IPostMenuRequest): Promise<ComidaEntity> {
    const item = this.menuRepository.create(data);
    return await this.menuRepository.save(item);
  }

  // actualiza un ítem existente, retorna undefined si no existe
  public async update(id: number, data: IPutMenuRequest) {
    const result = await this.menuRepository.update(id, data);
    if (result.affected === 0) return undefined;
    return result;
  }

  // elimina un ítem, retorna undefined si no existe
  public async delete(id: number) {
    const result = await this.menuRepository.delete(id);
    if (result.affected === 0) return undefined;
    return result;
  }
}