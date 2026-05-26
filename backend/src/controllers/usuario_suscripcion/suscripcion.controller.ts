import { Controller, Post, Body,Get, Res, UsePipes, ValidationPipe,Param,ParseIntPipe} from '@nestjs/common';
import type { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { SubscriptionsService } from '../../providers/usuario_suscripcion/suscripcion.service';
import { IPostSubscriptionRequest } from './dto/IPostSubscriptionRequest';
import type { IPostSubscriptionResponse } from './dto/IPostSubscriptionResponse';
import type { IGetSubscriptionStatusResponse } from './dto/IGetSubscriptionStatusResponse';


@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  // HU17 — Suscribir residente a un plan mensual
  @ApiOperation({
    summary: 'HU17 - Suscribir residente a un plan mensual',
    description:
      'Crea una suscripción mensual para un usuario residente. ' +
      'Cancela automáticamente cualquier suscripción activa previa. ' +
      'El usuario debe tener es_residente = true y el plan debe estar activo.',
  })
  @ApiBody({ type: IPostSubscriptionRequest })
  @ApiResponse({
    status: 201,
    description: 'Suscripción creada exitosamente',
    schema: {
      example: {
        data: {
          subscriptionId: 4,
          userId: 8,
          planId: 2,
          nombrePlan: 'Plan Residente Estándar (30 Comidas)',
          mesVigencia: '2026-05-01',
          estado: 'activo',
          precioFinal: 500000,
        },
        statusCode: 201,
        statusDescription: 'Suscripción creada exitosamente',
        errors: null,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no es residente, no existe, o el plan está inactivo',
    schema: {
      example: {
        data: null,
        statusCode: 404,
        statusDescription: 'Usuario no encontrado, no es residente, o plan inactivo',
        errors: 'No se pudo crear la suscripción',
      },
    },
  })
  @Post()
  @UsePipes(new ValidationPipe())
  async postSubscription(
    @Body() request: IPostSubscriptionRequest,
    @Res() response: Response,
  ): Promise<Response> {
    const result = await this.subscriptionsService.suscribir(request);

    if (!result) {
      const body: IPostSubscriptionResponse = {
        data: null,
        statusCode: 404,
        statusDescription: 'Usuario no encontrado, no es residente, o plan inactivo',
        errors: 'No se pudo crear la suscripción',
      };
      return response.status(404).json(body);
    }

    const { suscripcion, plan, precioFinal } = result;
    const body: IPostSubscriptionResponse = {
      data: {
        subscriptionId: suscripcion.id,
        userId: suscripcion.usuarioId,
        planId: suscripcion.planActivoId!,
        nombrePlan: plan.nombre,
        mesVigencia: suscripcion.mesVigencia.toISOString().split('T')[0],
        estado: suscripcion.estado,
        precioFinal,
      },
      statusCode: 201,
      statusDescription: 'Suscripción creada exitosamente',
      errors: null,
    };

    return response.status(201).json(body);
  }
// HU18 — Ver estado del plan activo
@ApiOperation({
  summary: 'HU18 - Ver estado del plan activo de un residente',
  description:
    'Devuelve los datos de la suscripción activa del usuario. ' +
    'Si el usuario no tiene suscripción activa o el plan_id es null, retorna 404.',
})
@ApiResponse({
  status: 200,
  description: 'Estado del plan activo encontrado',
  schema: {
    example: {
      subscriptionId: 4,
      userId: 8,
      estado: 'activo',
      mesVigencia: '2026-05-01',
      plan: {
        id: 2,
        nombre: 'Plan Residente Estándar (30 Comidas)',
        descripcion: 'El plan más popular. Cubre 1 almuerzo al día.',
        precioMensual: 500000,
      },
    },
  },
})
@ApiResponse({
  status: 404,
  description: 'El usuario no tiene ninguna suscripción activa',
  schema: {
    example: {
      message: 'No hay suscripción activa para este usuario',
    },
  },
})
@Get('user/:userId/status')
async getSubscriptionStatus(
  @Param('userId', ParseIntPipe) userId: number,
  @Res() response: Response,
): Promise<Response> {
  const result = await this.subscriptionsService.getEstadoPlan(userId);

  if (!result) {
    return response.status(404).json({
      message: 'No hay suscripción activa para este usuario',
    });
  }

  const { suscripcion, plan } = result;
  const body: IGetSubscriptionStatusResponse = {
    subscriptionId: suscripcion.id,
    userId: suscripcion.usuarioId,
    estado: suscripcion.estado,
    mesVigencia: new Date(suscripcion.mesVigencia).toISOString().split('T')[0],
    plan: {
      id: plan.id,
      nombre: plan.nombre,
      descripcion: plan.descripcion,
      precioMensual: Number(plan.precio_mensual),
    },
  };

  return response.status(200).json(body);
}


}