import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/database/entities/user.entity';
import { IPostUserRequest } from 'src/controllers/users/dto/IPostUserRequest';
import { IPutUserRequest } from 'src/controllers/users/dto/IPutUserRequest';

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
    return await this.userRepository.findOneBy({ email });
  }

  public async create(data: IPostUserRequest): Promise<UserEntity> {
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const item = this.userRepository.create({
      ...data,
      password: hashedPassword,
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