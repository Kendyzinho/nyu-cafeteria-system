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

  // 1. Verificar usuario residente activo
  const usuario = await this.usuarioRepository.findOne({
    where: { id: data.userId },
  });
  if (!usuario || !usuario.activo) return null;

  // 2. Verificar plan activo
const plan = await this.planRepository.findOne({
  where: { id: data.planId },
});
if (!plan || !plan.activo) return null;
// 2.1 Si el plan es exclusivo para residentes y el usuario no lo es → rechazar
  // 3. Primer día del mes actual
  // 3. Primer día del mes actual
  const now = new Date();
  const mesVigencia = new Date(now.getFullYear(), now.getMonth(), 1);
  // 4. UPSERT — actualizar si existe, crear si no existe
  const suscripcionExistente = await this.suscripcionRepository.findOne({
    where: { usuarioId: data.userId },
  });

  let saved: SuscripcionAlumnoEntity;

  if (suscripcionExistente) {
    suscripcionExistente.planActivoId = data.planId;
    suscripcionExistente.mesVigencia = mesVigencia;
    suscripcionExistente.estado = 'activo';
    saved = await this.suscripcionRepository.save(suscripcionExistente);
  } else {
    const nueva = this.suscripcionRepository.create({
      usuarioId: data.userId,
      planActivoId: data.planId,
      mesVigencia,
      estado: 'activo',
    });
    saved = await this.suscripcionRepository.save(nueva);
  }

  const precioFinal = Number(plan.precio_mensual);
  return { suscripcion: saved, plan, precioFinal };
}// HU18 — Ver estado del plan activo
public async getEstadoPlan(userId: number): Promise<{
  suscripcion: SuscripcionAlumnoEntity;
  plan: PlanesCatalogoEntity;
} | null> {

  const suscripcion = await this.suscripcionRepository.findOne({
    where: { usuarioId: userId, estado: 'activo' },
  });

  if (!suscripcion || !suscripcion.planActivoId) return null;

  const plan = await this.planRepository.findOne({
    where: { id: suscripcion.planActivoId },
  });

  if (!plan) return null;

  return { suscripcion, plan };
}
}