import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PedidoEntity } from 'src/database/entities/pedido.entity';
import type { IPostOrderRequest } from 'src/controllers/orders/dto/IPostOrderRequest';
import type { IPutOrderRequest } from 'src/controllers/orders/dto/IPutOrderRequest';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(PedidoEntity)
    private readonly orderRepository: Repository<PedidoEntity>,
  ) {}

  public async getAll(): Promise<PedidoEntity[]> {
    return await this.orderRepository.find();
  }

  public async getOne(id: number): Promise<PedidoEntity | null> {
    return await this.orderRepository
      .createQueryBuilder('pedido')
      .where('pedido.id = :id', { id })
      .getOne();
  }

  public async create(data: IPostOrderRequest): Promise<PedidoEntity> {
    const item = this.orderRepository.create({
      ...data,
      total: 0,
      estado: 'pendiente',
      fecha_creacion: new Date(),
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
