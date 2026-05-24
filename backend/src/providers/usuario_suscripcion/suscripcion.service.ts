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

  // 1. Verificar que el usuario existe y es residente activo
  const usuario = await this.usuarioRepository.findOne({
    where: { id: data.userId },
  });
  if (!usuario || !usuario.es_residente || !usuario.activo) return null;

  // 2. Verificar que el plan existe y está activo
  const plan = await this.planRepository.findOne({
    where: { id: data.planId },
  });
  if (!plan || !plan.activo) return null;

  // 3. Calcular primer día del mes actual como mes de vigencia
  const now = new Date();
  const mesVigencia = new Date(now.getFullYear(), now.getMonth(), 1);

  // 4. UPSERT — buscar si ya tiene una fila en suscripcion_alumno
  const suscripcionExistente = await this.suscripcionRepository.findOne({
    where: { usuarioId: data.userId },
  });

  let saved: SuscripcionAlumnoEntity;

  if (suscripcionExistente) {
    // Ya tiene fila → solo actualizar con el nuevo plan
    suscripcionExistente.planActivoId = data.planId;
    suscripcionExistente.mesVigencia = mesVigencia;
    suscripcionExistente.estado = 'activo';
    saved = await this.suscripcionRepository.save(suscripcionExistente);
  } else {
    // No tiene fila → crear nueva
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
}


}