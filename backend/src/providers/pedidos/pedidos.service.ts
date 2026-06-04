import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PedidoEntity } from 'src/database/entities/pedido.entity';
import { ComidaEntity } from 'src/database/entities/comida.entity';
import { DetallePedidoEntity } from 'src/database/entities/detalle-pedido.entity';
import type { IPostPedidoRequest } from 'src/controllers/pedidos/dto/IPostPedidoRequest';
import type { IPutPedidoRequest } from 'src/controllers/pedidos/dto/IPutPedidoRequest';
import { validarHorarioRetiro } from 'src/common/constants/cafeteria-horario';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(PedidoEntity)
    private readonly pedidoRepository: Repository<PedidoEntity>,
    @InjectRepository(ComidaEntity)
    private readonly comidaRepository: Repository<ComidaEntity>,
  ) {}

  private mapPedido(pedido: PedidoEntity) {
    const items = (pedido.detalles || []).map(d => ({
      productId: d.comidaId,
      id: d.comidaId,
      nombre: d.comida ? d.comida.nombre : `Producto #${d.comidaId}`,
      price: Number(d.precioUnitario),
      precio: Number(d.precioUnitario),
      quantity: d.cantidad,
      cantidad: d.cantidad,
    }));
    return { ...pedido, items };
  }

  public async getAll(): Promise<any[]> {
    const pedidos = await this.pedidoRepository.find({ relations: ['detalles', 'detalles.comida'] });
    return pedidos.map(p => this.mapPedido(p));
  }

  public async getByUser(usuarioId: number): Promise<any[]> {
    const pedidos = await this.pedidoRepository.find({
      where: { usuarioId },
      order: { fechaCreacion: 'DESC' },
      relations: ['detalles', 'detalles.comida'],
    });
    return pedidos.map(p => this.mapPedido(p));
  }

  public async getOne(id: number): Promise<PedidoEntity | null> {
    return await this.pedidoRepository
      .createQueryBuilder('pedido')
      .where('pedido.id = :id', { id })
      .getOne();
  }

  public async create(data: IPostPedidoRequest): Promise<PedidoEntity> {
    const horarioRetiro = new Date(data.horarioRetiro);
    const validacion = validarHorarioRetiro(horarioRetiro);
    if (!validacion.ok) {
      throw new BadRequestException(validacion.motivo);
    }

    let calculatedTotal = 0;

    if (data.items && data.items.length > 0) {
      for (const item of data.items) {
        const id = item.productId || item.id;
        const nombre = item.nombre || `Producto #${id}`;
        const precio = Number(item.price || item.precio) || 0;
        const cantidadComprada = Number(item.quantity || item.cantidad) || 1;
        calculatedTotal += precio * cantidadComprada;

        if (id) {
          const comidaItem = await this.comidaRepository.findOne({ where: { id } });
          if (comidaItem) {
            if (comidaItem.stock_actual < cantidadComprada) {
              throw new BadRequestException(`No hay suficiente stock para: ${nombre}`);
            }
            comidaItem.stock_actual -= cantidadComprada;
            await this.comidaRepository.save(comidaItem);
          }
        }
      }
    }

    const nuevoPedido = this.pedidoRepository.create({
      usuarioId: data.usuarioId,
      total: calculatedTotal,
      estado: data.ordenPagoId ? 'pagado' : 'pendiente',
      ordenPagoId: data.ordenPagoId ?? null,
      fechaCreacion: new Date(),
      horarioRetiro,
    });

    nuevoPedido.detalles = data.items.map(item => {
      const id = item.productId || item.id;
      const precio = Number(item.price || item.precio) || 0;
      const cantidadComprada = Number(item.quantity || item.cantidad) || 1;
      return new DetallePedidoEntity({
        comidaId: id,
        cantidad: cantidadComprada,
        precioUnitario: precio,
      });
    });

    return await this.pedidoRepository.save(nuevoPedido);
  }

  public async update(id: number, data: IPutPedidoRequest) {
    const result = await this.pedidoRepository.update(id, data);
    if (result.affected === 0) return undefined;
    return result;
  }

  public async delete(id: number) {
    const result = await this.pedidoRepository.delete(id);
    if (result.affected === 0) return undefined;
    return result;
  }
}
