import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuEntity } from 'src/database/entities/menu.entity';
import type { IPutMenuRequest } from 'src/controllers/menu/dto/IPutMenuRequest';
import type { IPostMenuRequest } from 'src/controllers/menu/dto/IPostMenuRequest';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuEntity)
    private readonly menuRepository: Repository<MenuEntity>,
  ) {}

  public async getAll(): Promise<MenuEntity[]> {
    return await this.menuRepository.find();
  }

  public async getOne(id: number): Promise<MenuEntity | null> {
    return await this.menuRepository
      .createQueryBuilder('menu')
      .where('menu.id = :id', { id })
      .getOne();
  }

  public async create(data: IPostMenuRequest): Promise<MenuEntity> {
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