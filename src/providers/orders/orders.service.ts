import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from 'src/database/entities/order.entity';
import type { IPostOrderRequest } from 'src/controllers/orders/dto/IPostOrderRequest';
import type { IPutOrderRequest } from 'src/controllers/orders/dto/IPutOrderRequest';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  public async getAll(): Promise<OrderEntity[]> {
    return await this.orderRepository.find();
  }

  public async getOne(id: number): Promise<OrderEntity | null> {
    return await this.orderRepository
      .createQueryBuilder('order')
      .where('order.id = :id', { id })
      .getOne();
  }

  public async create(data: IPostOrderRequest): Promise<OrderEntity> {
    const item = this.orderRepository.create({
      ...data,
      total: 0,
      estado: 'pendiente',
      fechaCreacion: new Date(),
    });
    return await this.orderRepository.save(item);
  }

  public async update(id: number, data: IPutOrderRequest) {
    const result = await this.orderRepository.update(id, data);
    if (result.affected === 0) return undefined;
    return result;
  }

  public async delete(id: number) {
    const result = await this.orderRepository.delete(id);
    if (result.affected === 0) return undefined;
    return result;
  }
}