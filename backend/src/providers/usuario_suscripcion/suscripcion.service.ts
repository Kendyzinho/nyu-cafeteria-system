import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SuscripcionAlumnoEntity } from '../../database/entities/suscripcion-alumno.entity';
import { PlanesCatalogoEntity } from '../../database/entities/planes-catalogo.entity';
import { MockUsuarioEntity } from '../../database/entities/mock-usuario.entity';

interface IPostSubscriptionRequest {
  userId: number;
  planId: number;
  ordenPagoId?: number;
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

  //  Suscribir residente a un plan mensual
 public async suscribir(data: IPostSubscriptionRequest): Promise<{
  suscripcion: SuscripcionAlumnoEntity;
  plan: PlanesCatalogoEntity;
  precioFinal: number;
} | null> {

<<<<<<< Updated upstream
  // 1. Verificar usuario residente activo
  
=======
  //  Verificar usuario residente activo
>>>>>>> Stashed changes
  const usuario = await this.usuarioRepository.findOne({
    where: { id: data.userId },
  });
  if (!usuario || !usuario.activo) return null;

  //  Verificar plan activo
const plan = await this.planRepository.findOne({
  where: { id: data.planId },
});

if (!plan || !plan.activo) return null;

if (plan.reqResidencia && !usuario.es_residente) return null;
<<<<<<< Updated upstream
  // 3. Primer día del mes actual
=======


>>>>>>> Stashed changes
  const now = new Date();
  const mesVigencia = new Date(now.getFullYear(), now.getMonth(), 1);

  const suscripcionExistente = await this.suscripcionRepository.findOne({
    where: { usuarioId: data.userId },
  });

  let saved: SuscripcionAlumnoEntity;

if (suscripcionExistente) {
  suscripcionExistente.planActivoId = data.planId;
  suscripcionExistente.mesVigencia = mesVigencia;
  suscripcionExistente.estado = 'activo';
  suscripcionExistente.comidasUsadas = 0;
  suscripcionExistente.canjesHoy = 0;
  suscripcionExistente.fechaUltimoCanje = null;
  suscripcionExistente.ordenPagoId = data.ordenPagoId ?? null;
  saved = await this.suscripcionRepository.save(suscripcionExistente);
} else {
    const nueva = this.suscripcionRepository.create({
      usuarioId: data.userId,
      planActivoId: data.planId,
      mesVigencia,
      estado: 'activo',
      ordenPagoId: data.ordenPagoId ?? null,
    });
    saved = await this.suscripcionRepository.save(nueva);
  }

  const precioFinal = Number(plan.precio_mensual);
  return { suscripcion: saved, plan, precioFinal };
<<<<<<< Updated upstream
  
}
=======
}// Ver estado del plan activo
public async getEstadoPlan(userId: number): Promise<{
  suscripcion: SuscripcionAlumnoEntity;
  plan: PlanesCatalogoEntity;
} | null> {
>>>>>>> Stashed changes

  // HU18 — Ver estado del plan activo
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
public async redimirComida(userId: number): Promise<{
  comidasUsadas: number;
  cantidadComidas: number;
  restantes: number;
  canjesHoy: number;
  limiteDiario: number;
} | null> {
  const suscripcion = await this.suscripcionRepository.findOne({
    where: { usuarioId: userId, estado: 'activo' },
  });

  if (!suscripcion || !suscripcion.planActivoId) return null;

  const plan = await this.planRepository.findOne({
    where: { id: suscripcion.planActivoId },
  });

  if (!plan) return null;

  // Validar que quedan usos mensuales
  if (suscripcion.comidasUsadas >= plan.cantidadComidas) return null;

  // Verificar límite diario
  const hoy = new Date().toISOString().split('T')[0]; // "2026-05-28"
  const ultimoCanje = suscripcion.fechaUltimoCanje
    ? new Date(suscripcion.fechaUltimoCanje).toISOString().split('T')[0]
    : null;

  if (ultimoCanje === hoy) {
    // Ya canjeó hoy — verificar si llegó al límite
    if (suscripcion.canjesHoy >= plan.limiteDiario) return null;
    suscripcion.canjesHoy += 1;
  } else {
    // Nuevo día — resetear el contador diario
    suscripcion.canjesHoy = 1;
  }

  suscripcion.fechaUltimoCanje = new Date();
  suscripcion.comidasUsadas += 1;
  await this.suscripcionRepository.save(suscripcion);

  return {
    comidasUsadas: suscripcion.comidasUsadas,
    cantidadComidas: plan.cantidadComidas,
    restantes: plan.cantidadComidas - suscripcion.comidasUsadas,
    canjesHoy: suscripcion.canjesHoy,
    limiteDiario: plan.limiteDiario,
  };
}
}