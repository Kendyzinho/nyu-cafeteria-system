import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PedidoEntity } from 'src/database/entities/pedido.entity';
import { ComidaEntity } from 'src/database/entities/comida.entity';
import { DetallePedidoEntity } from 'src/database/entities/detalle-pedido.entity';
import type { IPostOrderRequest } from 'src/controllers/orders/dto/IPostOrderRequest';
import type { IPutOrderRequest } from 'src/controllers/orders/dto/IPutOrderRequest';
import { validarHorarioRetiro } from 'src/common/constants/cafeteria-horario';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(PedidoEntity)
    private readonly orderRepository: Repository<PedidoEntity>,
    @InjectRepository(ComidaEntity)
    private readonly menuRepository: Repository<ComidaEntity>,
  ) { }

  private mapOrder(order: PedidoEntity) {
    const items = (order.detalles || []).map(d => ({
      productId: d.comidaId,
      id: d.comidaId,
      nombre: d.comida ? d.comida.nombre : `Producto #${d.comidaId}`,
      price: Number(d.precioUnitario),
      precio: Number(d.precioUnitario),
      quantity: d.cantidad,
      cantidad: d.cantidad,
    }));
    return { ...order, items };
  }

  public async getAll(): Promise<any[]> {
    const orders = await this.orderRepository.find({ relations: ['detalles', 'detalles.comida'] });
    return orders.map(o => this.mapOrder(o));
  }

  public async getByUser(usuarioId: number): Promise<any[]> {
    const orders = await this.orderRepository.find({
      where: { usuarioId },
      order: { fechaCreacion: 'DESC' },
      relations: ['detalles', 'detalles.comida'],
    });
    return orders.map(o => this.mapOrder(o));
  }

  public async getOne(id: number): Promise<PedidoEntity | null> {
    return await this.orderRepository
      .createQueryBuilder('order')
      .where('order.id = :id', { id })
      .getOne();
  }

  public async create(data: IPostOrderRequest): Promise<PedidoEntity> {
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
          const comidaItem = await this.menuRepository.findOne({ where: { id } });
          if (comidaItem) {
            if (comidaItem.stockActual < cantidadComprada) {
              throw new BadRequestException(`No hay suficiente stock para: ${nombre}`);
            }
            comidaItem.stockActual -= cantidadComprada;
            await this.menuRepository.save(comidaItem);
          }
        }
      }
    }

    const newOrder = this.orderRepository.create({
      usuarioId: data.usuarioId,
      total: calculatedTotal,
      estado: 'pendiente',
      fechaCreacion: new Date(),
      horarioRetiro,
    });

    // Build the Detalles array
    newOrder.detalles = data.items.map(item => {
      const id = item.productId || item.id;
      const precio = Number(item.price || item.precio) || 0;
      const cantidadComprada = Number(item.quantity || item.cantidad) || 1;
      return new DetallePedidoEntity({
        comidaId: id,
        cantidad: cantidadComprada,
        precioUnitario: precio
      });
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