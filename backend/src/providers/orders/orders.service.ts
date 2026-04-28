import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { OrderEntity } from 'src/database/entities/order.entity';
import { UserEntity } from 'src/database/entities/user.entity';
import { PromotionEntity } from 'src/database/entities/promotion.entity';
import { MenuEntity } from 'src/database/entities/menu.entity';
import type { IPostOrderRequest } from 'src/controllers/orders/dto/IPostOrderRequest';
import type { IPutOrderRequest } from 'src/controllers/orders/dto/IPutOrderRequest';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(PromotionEntity)
    private readonly promoRepo: Repository<PromotionEntity>,
    @InjectRepository(MenuEntity)
    private readonly menuRepo: Repository<MenuEntity>,
  ) {}

  public async getAll(): Promise<OrderEntity[]> {
    return await this.orderRepository.find({ order: { fechaCreacion: 'DESC' } });
  }

  public async getHistory(usuarioId: number): Promise<OrderEntity[]> {
    return await this.orderRepository.find({ where: { usuarioId }, order: { fechaCreacion: 'DESC' } });
  }

  public async getOne(id: number): Promise<OrderEntity | null> {
    return await this.orderRepository.findOne({ where: { id } });
  }

  public async calculate(data: { usuarioId: number, items: { id: number, cantidad: number }[], fechaRetiro?: string }) {
    const user = await this.userRepo.findOne({ where: { id: data.usuarioId } });
    if (!user) throw new BadRequestException('Usuario no encontrado');

    const currentDate = new Date();
    const promotions = await this.promoRepo.find({
      where: { activa: true, fechaInicio: LessThanOrEqual(currentDate), fechaFin: MoreThanOrEqual(currentDate) }
    });

    const applicablePromos = promotions.filter(p => {
      if (p.reqMatricula && !user.matriculaActiva) return false;
      if (p.reqResidencia && !user.residenciaActiva) return false;
      return true;
    });

    let subtotal = 0;
    let total = 0;
    const descuentosAplicados: any[] = [];
    const itemsDetails: any[] = [];

    for (const item of data.items) {
      const product = await this.menuRepo.findOne({ where: { id: item.id } });
      if (!product) throw new BadRequestException(`Producto ${item.id} no encontrado`);
      if (product.stockActual < item.cantidad) throw new BadRequestException(`Stock insuficiente para ${product.nombre}`);

      const itemTotalBase = product.precio * item.cantidad;
      subtotal += itemTotalBase;

      // Find best promotion for this product
      let bestDiscountPct = 0;
      let appliedPromoName: string | null = null;

      for (const promo of applicablePromos) {
        let applies = false;
        if (promo.tipoAplicacion === 'todo') applies = true;
        else if (promo.tipoAplicacion === 'categoria' && promo.categoria === product.categoria) applies = true;
        else if (promo.tipoAplicacion === 'producto' && promo.productosIds && promo.productosIds.includes(product.id)) applies = true;

        if (applies && promo.descuento > bestDiscountPct) {
          bestDiscountPct = promo.descuento;
          appliedPromoName = promo.nombre;
        }
      }

      const discountAmount = itemTotalBase * (bestDiscountPct / 100);
      const itemFinalTotal = itemTotalBase - discountAmount;
      total += itemFinalTotal;

      itemsDetails.push({
        id: product.id,
        nombre: product.nombre,
        cantidad: item.cantidad,
        precioUnitario: product.precio,
        subtotalItem: itemTotalBase,
        descuentoAplicado: discountAmount,
        totalItem: itemFinalTotal
      });

      if (discountAmount > 0) {
        descuentosAplicados.push({
          producto: product.nombre,
          promocion: appliedPromoName,
          porcentaje: bestDiscountPct,
          montoDescontado: discountAmount
        });
      }
    }

    return {
      subtotal,
      total,
      descuentosAplicados,
      itemsDetails
    };
  }

  // Integración: Simulación de Sistema de Pagos y Tesorería
  private async processPayment(total: number): Promise<boolean> {
    return new Promise(resolve => setTimeout(() => resolve(true), 1500));
  }

  public async checkout(data: { usuarioId: number, items: { id: number, cantidad: number }[], fechaRetiro?: string }) {
    if (!data.items || data.items.length === 0) throw new BadRequestException('El carrito está vacío');

    // 1. Calcular totales usando las reglas de promoción
    const calc = await this.calculate(data);

    // 2. Integración: Simular pago en Tesorería
    const paymentSuccess = await this.processPayment(calc.total);
    if (!paymentSuccess) throw new BadRequestException('Pago rechazado por el Sistema de Tesorería Central');

    // 3. Descontar stock (Regla: Bloqueo de productos agotados)
    for (const item of data.items) {
      const product = await this.menuRepo.findOne({ where: { id: item.id } });
      if (product) {
        product.stockActual -= item.cantidad;
        if (product.stockActual <= 0) {
          product.stockActual = 0;
          product.disponible = false;
        }
        await this.menuRepo.save(product);
      }
    }

    // 4. Guardar la orden confirmada
    const order = this.orderRepository.create({
      usuarioId: data.usuarioId,
      items: calc.itemsDetails,
      total: calc.total,
      estado: 'pagado',
      fechaCreacion: new Date(),
      fechaRetiro: data.fechaRetiro ? new Date(data.fechaRetiro) : undefined,
      descuentosAplicados: calc.descuentosAplicados
    });

    return await this.orderRepository.save(order);
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

  // legacy create left for fallback/admin if needed
  public async create(data: IPostOrderRequest): Promise<OrderEntity> {
    const item = this.orderRepository.create({
      ...data,
      total: 0,
      estado: 'pendiente',
      fechaCreacion: new Date(),
    });
    return await this.orderRepository.save(item);
  }
}