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
  return response.status(201).json({
    message: 'Suscripción creada con éxito',
    data: result
  });
  // ... resto igual
}
}