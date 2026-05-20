import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MockUsuarioEntity } from 'src/database/entities/mock-usuario.entity';
import type { IPostUserRequest } from 'src/controllers/users/dto/IPostUserRequest';
import type { IPutUserRequest } from 'src/controllers/users/dto/IPutUserRequest';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(MockUsuarioEntity)
    private readonly userRepository: Repository<MockUsuarioEntity>,
  ) {}

  public async getAll(): Promise<MockUsuarioEntity[]> {
    return await this.userRepository.find();
  }

  public async getOne(id: number): Promise<MockUsuarioEntity | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
  }

  public async findByEmail(email: string): Promise<MockUsuarioEntity | null> {
    return await this.userRepository.findOneBy({ email });
  }

  public async create(data: IPostUserRequest): Promise<MockUsuarioEntity> {
    const item = this.userRepository.create(data);
    return await this.userRepository.save(item);
  }

  public async update(id: number, data: IPutUserRequest) {
    const result = await this.userRepository.update(id, data);
    if (result.affected === 0) return undefined;
    return result;
  }

  public async delete(id: number) {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) return undefined;
    return result;
  }
}