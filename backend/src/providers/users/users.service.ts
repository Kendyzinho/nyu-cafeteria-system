import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/database/entities/user.entity';
import type { IPostUserRequest } from 'src/controllers/users/dto/IPostUserRequest';
import type { IPutUserRequest } from 'src/controllers/users/dto/IPutUserRequest';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async getAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  public async getOne(id: number): Promise<UserEntity | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('LOWER(user.email) = LOWER(:email)', { email })
      .getOne();
  }

  public async create(data: IPostUserRequest): Promise<UserEntity> {
    const isBcryptPassword = data.password.startsWith('$2a$') || data.password.startsWith('$2b$');
    const password = isBcryptPassword ? data.password : await bcrypt.hash(data.password, 10);

    const item = this.userRepository.create({
      ...data,
      email: data.email.trim().toLowerCase(),
      password,
    });
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
