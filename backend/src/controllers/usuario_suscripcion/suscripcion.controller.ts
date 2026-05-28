import { Controller, Post, Body, Get, Res, Req,
         UsePipes, ValidationPipe, Param, ParseIntPipe,
         UseGuards } from '@nestjs/common';
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
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { Request } from 'express';




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
  @UseGuards(JwtAuthGuard)        // ← valida el token
@Post()
@UsePipes(new ValidationPipe())
async postSubscription(
  @Req() req: Request,          // ← extrae el usuario del token
  @Body() body: { planId: number },
  @Res() response: Response,
): Promise<Response> {
  const userId = (req.user as any).id;  // viene del JwtStrategy
  const result = await this.subscriptionsService.suscribir({
    userId,
    planId: body.planId,
  });
if (!result) {
  return response.status(404).json({
    data: null,
    statusCode: 404,
    statusDescription: 'Usuario no encontrado, no es residente, o plan inactivo',
    errors: 'No se pudo crear la suscripción',
  });
}

const { suscripcion, plan, precioFinal } = result;
return response.status(201).json({
  data: {
    subscriptionId: suscripcion.id,
    userId: suscripcion.usuarioId,
    planId: suscripcion.planActivoId,
    nombrePlan: plan.nombre,
    mesVigencia: new Date(suscripcion.mesVigencia).toISOString().split('T')[0],
    comidasUsadas: suscripcion.comidasUsadas,  
    estado: suscripcion.estado,
    precioFinal,
  },
  statusCode: 201,
  statusDescription: 'Suscripción creada exitosamente',
  errors: null,
});

}
  // HU18 — Ver estado del plan activo
  @ApiOperation({
    summary: 'HU18 - Ver estado del plan activo de un residente',
    description: 'Retorna la suscripción activa del usuario. Retorna 404 si no tiene plan activo.',
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
        comidasUsadas: 5,
        plan: {
          id: 2,
          nombre: 'Plan Residente Estándar (30 Comidas)',
          descripcion: 'El plan más popular.',
          precioMensual: 500000,
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'No hay suscripción activa para este usuario',
  })
  @UseGuards(JwtAuthGuard)
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
      comidasUsadas: suscripcion.comidasUsadas,
      plan: {
        id: plan.id,
        nombre: plan.nombre,
        descripcion: plan.descripcion,
        precioMensual: Number(plan.precio_mensual),
         cantidadComidas: plan.cantidadComidas,
      },
    };

    return response.status(200).json(body);
  }
@ApiOperation({ summary: 'Canjear una comida del plan activo' })
@ApiResponse({ status: 200, schema: { example: { comidasUsadas: 6, cantidadComidas: 20, restantes: 14 } } })
@ApiResponse({ status: 400, description: 'Sin usos disponibles o sin plan activo' })
@UseGuards(JwtAuthGuard)
@Post('user/:userId/redeem')
async redimirComida(
  @Param('userId', ParseIntPipe) userId: number,
  @Res() response: Response,
): Promise<Response> {
  const result = await this.subscriptionsService.redimirComida(userId);

  if (!result) {
    return response.status(400).json({
      message: 'No tenés usos disponibles o no tenés plan activo.',
    });
  }

  return response.status(200).json(result);
}
}