import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSubscriptionEntity } from '../../database/entities/user-subscription.entity';
import { MealPlanEntity } from '../../database/entities/meal-plan.entity';
import { UserEntity } from '../../database/entities/user.entity';
import type { IPostSubscriptionRequest } from '../../controllers/subscriptions/dto/IPostSubscriptionRequest';

// Descuentos por tipo de usuario parte HU19
const DESCUENTOS_POR_TIPO: Record<string, number> = {
  Residente: 0,       // Sin descuento adicional
  Estudiante: 0.10,   // 10% por ser estudiante activo
  Becado: 0.20,       // 20% para becados
  Administrador: 0,
  Cliente: 0,
};

// Número de comidas según tipo de plan 
const COMIDAS_POR_TIPO: Record<string, number> = {
  flex: 15,
  estandar: 30,
  premium: 60,
};

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(UserSubscriptionEntity)
    private readonly subscriptionRepository: Repository<UserSubscriptionEntity>,
    @InjectRepository(MealPlanEntity)
    private readonly mealPlanRepository: Repository<MealPlanEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // HU19 — Calcula el descuento según el tipo/perfil del usuario
  public calcularDescuento(tipoUsuario: string): number {
    return DESCUENTOS_POR_TIPO[tipoUsuario] ?? 0;
  }

  // HU17 — Suscribe a un usuario a un plan mensual
  public async suscribir(data: IPostSubscriptionRequest): Promise<{
    subscription: UserSubscriptionEntity;
    precioFinal: number;
  } | null> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: data.userId })
      .getOne();

    if (!user) return null;

    const plan = await this.mealPlanRepository
      .createQueryBuilder('plan')
      .where('plan.id = :id', { id: data.planId })
      .getOne();

    if (!plan || !plan.activo) return null;

    // Cancelar suscripción activa previa del usuario
    await this.subscriptionRepository
      .createQueryBuilder()
      .update(UserSubscriptionEntity)
      .set({ activa: false })
      .where('userId = :userId AND activa = true', { userId: data.userId })
      .execute();

    const descuento = this.calcularDescuento(user.tipo);
    const precioFinal = Number(plan.precio) * (1 - descuento);

    const fechaInicio = new Date();
    const fechaFin = new Date();
    fechaFin.setMonth(fechaFin.getMonth() + 1);

    const subscription = this.subscriptionRepository.create({
      userId: data.userId,
      planId: data.planId,
      fechaInicio,
      fechaFin,
      consumosUsados: 0,
      activa: true,
      descuentoAplicado: descuento * 100,
    });

    const saved = await this.subscriptionRepository.save(subscription);
    return { subscription: saved, precioFinal };
  }

  // HU18 — Obtiene el estado actual del plan activo del usuario
  public async getEstadoPlan(userId: number): Promise<{
    subscription: UserSubscriptionEntity;
    plan: MealPlanEntity;
    consumosDisponibles: number;
    precioFinal: number;
  } | null> {
    const subscription = await this.subscriptionRepository
      .createQueryBuilder('sub')
      .where('sub.userId = :userId AND sub.activa = true', { userId })
      .getOne();

    if (!subscription) return null;

    const plan = await this.mealPlanRepository
      .createQueryBuilder('plan')
      .where('plan.id = :id', { id: subscription.planId })
      .getOne();

    if (!plan) return null;

    const totalComidas = COMIDAS_POR_TIPO[plan.tipo?.toLowerCase()] ?? 30;
    const consumosDisponibles = totalComidas - subscription.consumosUsados;
    const descuentoDecimal = Number(subscription.descuentoAplicado) / 100;
    const precioFinal = Number(plan.precio) * (1 - descuentoDecimal);

    return { subscription, plan, consumosDisponibles, precioFinal };
  }

  // Registra el uso de una comida (consumo)
  public async registrarConsumo(userId: number): Promise<UserSubscriptionEntity | null> {
        //Buscar la suscripción activa del usuario
    const subscription = await this.subscriptionRepository
      .createQueryBuilder('sub')
      .where('sub.userId = :userId AND sub.activa = true', { userId })
      .getOne();

    if (!subscription) return null;
    //Buscar los detalles del plan de comidas
    const plan = await this.mealPlanRepository
      .createQueryBuilder('plan')
      .where('plan.id = :id', { id: subscription.planId })
      .getOne();

    if (!plan) return null;
//Calcular el límite de comidas permitidas
    const totalComidas = COMIDAS_POR_TIPO[plan.tipo?.toLowerCase()] ?? 30;
//Validar si le quedan comidas disponibles
    if (subscription.consumosUsados >= totalComidas) return null;
//Registrar el consumo y guardar
    subscription.consumosUsados += 1;
    return await this.subscriptionRepository.save(subscription);
  }
}
