import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from 'src/database/entities/order.entity';
import { StockEntity } from 'src/database/entities/stock.entity';
import type { IPostOrderRequest } from 'src/controllers/orders/dto/IPostOrderRequest';
import type { IPutOrderRequest } from 'src/controllers/orders/dto/IPutOrderRequest';
import { validarHorarioRetiro } from 'src/common/constants/cafeteria-horario';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(StockEntity)
    private readonly stockRepository: Repository<StockEntity>,
  ) { }

  public async getAll(): Promise<OrderEntity[]> {
    return await this.orderRepository.find();
  }

  public async getByUser(usuarioId: number): Promise<OrderEntity[]> {
    return await this.orderRepository.find({
      where: { usuarioId },
      order: { fechaCreacion: 'DESC' }
    });
  }

  public async getOne(id: number): Promise<OrderEntity | null> {
    return await this.orderRepository
      .createQueryBuilder('order')
      .where('order.id = :id', { id })
      .getOne();
  }

  public async create(data: IPostOrderRequest): Promise<OrderEntity> {
    const horarioRetiro = new Date(data.horarioRetiro);
    const validacion = validarHorarioRetiro(horarioRetiro);
    if (!validacion.ok) {
      throw new BadRequestException(validacion.motivo);
    }

    // Calculamos el total dinámicamente y restamos el stock
    let calculatedTotal = 0;

    if (data.items && data.items.length > 0) {
      for (const item of data.items) {
        const id = item.productId || item.id;
        const nombre = item.nombre || `Producto #${id}`;
        const precio = Number(item.price || item.precio) || 0;
        const cantidadComprada = Number(item.quantity || item.cantidad) || 1;
        calculatedTotal += (precio * cantidadComprada);

        // Descontar del inventario
        if (id) {
          const stockItem = await this.stockRepository.findOne({ where: { menuItemId: id } });
          if (stockItem) {
            if (stockItem.cantidad < cantidadComprada) {
              throw new BadRequestException(`No hay suficiente stock para: ${nombre}`);
            }
            stockItem.cantidad -= cantidadComprada;
            stockItem.ultimaActualizacion = new Date();
            await this.stockRepository.save(stockItem);
          }
        }
      }
    }

    const newOrder = this.orderRepository.create({
      usuarioId: data.usuarioId,
      items: data.items,
      total: calculatedTotal,
      estado: 'pendiente',
      fechaCreacion: new Date(),
      horarioRetiro,
    });
    return await this.orderRepository.save(newOrder);
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