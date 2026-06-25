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

  //  Verificar usuario residente activo
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
}

  //  Ver estado del plan activo
  public async getEstadoPlan(userId: number): Promise<{
    suscripcion: SuscripcionAlumnoEntity;
    plan: PlanesCatalogoEntity;
  } | null> {
    const suscripcion = await this.suscripcionRepository.findOne({
      where: { usuarioId: userId, estado: 'activo' },
    });

    if (!suscripcion || !suscripcion.planActivoId) return null;

    const plan = await this.planRepository.findOne({
      where: { id: suscripcion.planActivoId, activo: true },
    });

    if (!plan) return null;

    return { suscripcion, plan };
  }

  public async redimirComida(userId: number, cantidad: number = 1): Promise<{
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
    where: { id: suscripcion.planActivoId, activo: true },
  });
  if (!plan) return null;

  // Validar que quedan usos mensuales
  if (suscripcion.comidasUsadas + cantidad > plan.cantidadComidas) return null;

   // Verificar límite diario
  const hoy = new Date().toLocaleDateString('en-CA');
  let ultimoCanje: string | null = null;
  if (suscripcion.fechaUltimoCanje) {
    const d = new Date(suscripcion.fechaUltimoCanje);
    d.setUTCHours(12); // DATE de MySQL llega como medianoche UTC; +12h evita el desfase horario
    ultimoCanje = d.toLocaleDateString('en-CA');
  }

  if (ultimoCanje === hoy) {
    if (suscripcion.canjesHoy + cantidad > plan.limiteDiario) return null;
    suscripcion.canjesHoy += cantidad;   // ← esta línea también faltaba
  } else {
    suscripcion.canjesHoy = cantidad;
  }

  const todayLocal = new Date().toLocaleDateString('en-CA');
  suscripcion.fechaUltimoCanje = new Date(todayLocal + 'T12:00:00Z'); // Guardar como mediodía UTC
  suscripcion.comidasUsadas += cantidad;
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