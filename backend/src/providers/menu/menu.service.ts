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

  // mapea la entidad al formato que espera el frontend
  private async toResponse(item: ComidaEntity) {
    const isActuallyAvailable = item.disponible && item.stock_actual > 0;

    return {
      id: item.id,
      nombre: item.nombre,
      descripcion: item.descripcion,
      precio: Number(item.precio),
      categoria: item.categoria,
      disponible: isActuallyAvailable,
      stock_actual: item.stock_actual,
      imagen_url: item.imagen_url ?? '',
      precio_estudiante: +(Number(item.precio) * 0.75).toFixed(0),
    };
  }

  public async getAll() {
    const items = await this.menuRepository.find();
    return await Promise.all(items.map(item => this.toResponse(item)));
  }

  public async getOne(id: number) {
    const item = await this.menuRepository
      .createQueryBuilder('comida')
      .where('comida.id = :id', { id })
      .getOne();
    if (!item) return null;
    return await this.toResponse(item);
  }

  // crea un nuevo ítem en la base de datos
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
