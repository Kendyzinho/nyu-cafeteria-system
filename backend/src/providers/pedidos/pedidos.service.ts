import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PedidoEntity } from 'src/database/entities/pedido.entity';
import { ComidaEntity } from 'src/database/entities/comida.entity';
import { DetallePedidoEntity } from 'src/database/entities/detalle-pedido.entity';
import type { IPostPedidoRequest } from 'src/controllers/pedidos/dto/IPostPedidoRequest';
import type { IPutPedidoRequest } from 'src/controllers/pedidos/dto/IPutPedidoRequest';
import { validarHorarioRetiro } from 'src/common/constants/cafeteria-horario';
import { MockUsuarioEntity } from 'src/database/entities/mock-usuario.entity';
import { PromocionEntity } from 'src/database/entities/promocion.entity';
import { SubscriptionsService } from 'src/providers/usuario_suscripcion/suscripcion.service';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(PedidoEntity)
    private readonly pedidoRepository: Repository<PedidoEntity>,
    @InjectRepository(ComidaEntity)
    private readonly comidaRepository: Repository<ComidaEntity>,
    @InjectRepository(MockUsuarioEntity)
    private readonly usuarioRepository: Repository<MockUsuarioEntity>,
    @InjectRepository(PromocionEntity)
    private readonly promocionRepository: Repository<PromocionEntity>,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  private async calcularDescuento(usuarioId: number, itemIds: number[]): Promise<number> {
  const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });

  // Solo estudiantes activos califican para descuentos
  if (!usuario || !usuario.activo) return 0;

  const ahora = new Date();
  const horaActual = ahora.toTimeString().slice(0, 8); // "HH:MM:SS"

  const promociones = await this.promocionRepository.find({ where: { activa: true } });

  const aplicables = promociones.filter(p => {
    // Verifica horario activo
    if (horaActual < p.horaInicio || horaActual > p.horaFin) return false;
    // Si la promo aplica a comidas específicas, verificar que haya al menos una
    if (p.comidasIds && p.comidasIds.length > 0) {
      return itemIds.some(id => p.comidasIds!.includes(id));
    }
    return true;
  });
  if (aplicables.length === 0) return 0;
  const total = aplicables.reduce((sum, p) => sum + Number(p.descuento), 0);
  return Math.min(total, 100);}

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

    if (data.metodoPago === 'Plan') {
      const resultado = await this.subscriptionsService.redimirComida(data.usuarioId);
      if (!resultado) {
        throw new BadRequestException('No tienes usos disponibles en tu plan (límite mensual o diario alcanzado).');
      }
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
        
    const itemIds = data.items.map(i => i.id || i.productId).filter(Boolean) as number[];
    const porcentajeDescuento = await this.calcularDescuento(data.usuarioId, itemIds);
    if (porcentajeDescuento > 0) {
      calculatedTotal = calculatedTotal * (1 - porcentajeDescuento / 100);
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
public async getDescuentoPerfil(usuarioId: number): Promise<{
  usuarioActivo: boolean;
  porcentajeDescuento: number;
  promocionAplicada: string | null;
}> {
  const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });

if (!usuario || !usuario.activo) {
  return { usuarioActivo: false, porcentajeDescuento: 0, promocionAplicada: null };
}
  const ahora = new Date();
  const horaActual = ahora.toTimeString().slice(0, 8);
  const promociones = await this.promocionRepository.find({ where: { activa: true } });

 const aplicables = promociones.filter(p => {
  if (horaActual < p.horaInicio || horaActual > p.horaFin) return false;
  return true;
});

  if (aplicables.length === 0) {
    return { usuarioActivo: true, porcentajeDescuento: 0, promocionAplicada: null };
  }

  const totalDescuento = Math.min(
  aplicables.reduce((sum, p) => sum + Number(p.descuento), 0),
  100
);
const nombresAplicados = aplicables.map(p => p.nombre).join(' + ');
return {
  usuarioActivo: true,
  porcentajeDescuento: totalDescuento,
  promocionAplicada: nombresAplicados || null,
};

}
}
