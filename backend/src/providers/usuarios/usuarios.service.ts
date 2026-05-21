import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MockUsuarioEntity } from 'src/database/entities/mock-usuario.entity';
import type { IPostUsuarioRequest } from 'src/controllers/usuarios/dto/IPostUsuarioRequest';
import type { IPutUsuarioRequest } from 'src/controllers/usuarios/dto/IPutUsuarioRequest';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(MockUsuarioEntity)
    private readonly usuarioRepository: Repository<MockUsuarioEntity>,
  ) {}

  public async getAll(): Promise<MockUsuarioEntity[]> {
    return await this.usuarioRepository.find();
  }

  public async getOne(id: number): Promise<MockUsuarioEntity | null> {
    return await this.usuarioRepository
      .createQueryBuilder('usuario')
      .where('usuario.id = :id', { id })
      .getOne();
  }

  public async findByEmail(email: string): Promise<MockUsuarioEntity | null> {
    return await this.usuarioRepository.findOneBy({ email });
  }

  public async create(data: IPostUsuarioRequest): Promise<MockUsuarioEntity> {
    const item = this.usuarioRepository.create(data);
    return await this.usuarioRepository.save(item);
  }

  public async update(id: number, data: IPutUsuarioRequest) {
    const result = await this.usuarioRepository.update(id, data);
    if (result.affected === 0) return undefined;
    return result;
  }

  public async delete(id: number) {
    const result = await this.usuarioRepository.delete(id);
    if (result.affected === 0) return undefined;
    return result;
  }
}
