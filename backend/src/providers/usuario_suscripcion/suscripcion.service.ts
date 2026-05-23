import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SuscripcionAlumnoEntity } from '../../database/entities/suscripcion-alumno.entity';
import { PlanesCatalogoEntity } from '../../database/entities/planes-catalogo.entity';
import { MockUsuarioEntity } from '../../database/entities/mock-usuario.entity';

interface IPostSubscriptionRequest {
  userId: number;
  planId: number;
}

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(SuscripcionAlumnoEntity)
    private readonly suscripcionRepository: Repository<SuscripcionAlumnoEntity>,

    @InjectRepository(PlanesCatalogoEntity)
    private readonly planRepository: Repository<PlanesCatalogoEntity>,

    @InjectRepository(MockUsuarioEntity)
    private readonly usuarioRepository: Repository<MockUsuarioEntity>,
  ) {}

  // HU17 — Suscribir residente a un plan mensual
  public async suscribir(data: IPostSubscriptionRequest): Promise<{
    suscripcion: SuscripcionAlumnoEntity;
    plan: PlanesCatalogoEntity;
    precioFinal: number;
  } | null> {

    // 1. Buscar el usuario y verificar que es residente activo
    const usuario = await this.usuarioRepository.findOne({
      where: { id: data.userId },
    });
    if (!usuario || !usuario.es_residente || !usuario.activo) return null;

    // 2. Buscar el plan y verificar que está activo
    const plan = await this.planRepository.findOne({
      where: { id: data.planId },
    });
    if (!plan || !plan.activo) return null;

    // 3. Primer día del mes actual → es el mes de vigencia
    const now = new Date();
    const mesVigencia = new Date(now.getFullYear(), now.getMonth(), 1);

    // 4. Cancelar suscripción activa previa del usuario en este mes
    await this.suscripcionRepository
      .createQueryBuilder()
      .update(SuscripcionAlumnoEntity)
      .set({ estado: 'cancelado' })
      .where('usuarioId = :userId AND estado = :estado', {
        userId: data.userId,
        estado: 'activo',
      })
      .execute();

    // 5. Crear la nueva suscripción
    const nueva = this.suscripcionRepository.create({
      usuarioId: data.userId,
      planActivoId: data.planId,
      mesVigencia,
      estado: 'activo',
    });

    const saved = await this.suscripcionRepository.save(nueva);
    const precioFinal = Number(plan.precio_mensual);

    return { suscripcion: saved, plan, precioFinal };

  }
  // HU18 — Ver estado del plan activo de un usuario residente
public async getEstadoPlan(userId: number): Promise<{
  suscripcion: SuscripcionAlumnoEntity;
  plan: PlanesCatalogoEntity;
} | null> {

  // 1. Buscar la suscripción activa del usuario
  const suscripcion = await this.suscripcionRepository.findOne({
    where: { usuarioId: userId, estado: 'activo' },
  });

  // Si no tiene ninguna suscripción activa, retorna null
  if (!suscripcion || !suscripcion.planActivoId) return null;

  // 2. Buscar los detalles del plan asociado
  const plan = await this.planRepository.findOne({
    where: { id: suscripcion.planActivoId },
  });

  if (!plan) return null;

  return { suscripcion, plan };
}
}