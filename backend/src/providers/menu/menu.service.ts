import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuEntity } from 'src/database/entities/menu.entity';
import type { IPutMenuRequest } from 'src/controllers/menu/dto/IPutMenuRequest';
import type { IPostMenuRequest } from 'src/controllers/menu/dto/IPostMenuRequest';

@Injectable() // marca la clase como un provider inyectable
export class MenuService {

  constructor(
    // inyecta el repositorio para operar sobre la tabla 'menu'
    @InjectRepository(MenuEntity)
    private readonly menuRepository: Repository<MenuEntity>,
  ) {}

  // mapea la entidad al formato que espera el frontend
  private toResponse(item: MenuEntity) {
    return {
      id: item.id,
      name: item.nombre,
      category: item.categoria,
      description: item.descripcion,
      price: Number(item.precio),
      studentPrice: +(Number(item.precio) * 0.75).toFixed(0), // calcula 25% de descuento
      image: item.image ?? '',   // si no tiene imagen retorna string vacío
      isAvailable: item.disponible,
    };
  }

  // obtiene todos los ítems del menú y los mapea al formato del frontend
  public async getAll() {
    const items = await this.menuRepository.find();
    return items.map(item => this.toResponse(item));
  }

  // obtiene un ítem por id
  public async getOne(id: number) {
    const item = await this.menuRepository
      .createQueryBuilder('menu')
      .where('menu.id = :id', { id })
      .getOne();
    if (!item) return null;
    return this.toResponse(item);
  }

  // crea un nuevo ítem en la base de datos
  public async create(data: IPostMenuRequest): Promise<MenuEntity> {
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