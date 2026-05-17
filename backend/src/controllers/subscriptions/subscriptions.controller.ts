import { Controller, Get, Post, Param, Body, Res, ParseIntPipe } from '@nestjs/common';
import type { Response } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SubscriptionsService } from '../../providers/subscriptions/subscriptions.service';
import { IPostSubscriptionRequest } from './dto/IPostSubscriptionRequest';
import type { IPostSubscriptionResponse } from './dto/IPostSubscriptionResponse';
import type { IGetSubscriptionStatusResponse } from './dto/IGetSubscriptionStatusResponse';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  // HU17 — Suscribir a un residente a un plan mensual
  @ApiOperation({ summary: 'Suscribir usuario a un plan mensual' })
  @Post()
  async postSubscription(
    @Body() request: IPostSubscriptionRequest,
    @Res() response: Response,
  ): Promise<Response> {
    const result = await this.subscriptionsService.suscribir(request);

    if (!result) {
      const body: IPostSubscriptionResponse = {
        data: null,
        statusCode: 404,
        statusDescription: 'Usuario o plan no encontrado / plan inactivo',
        errors: 'No se pudo crear la suscripción',
      };
      return response.status(404).json(body);
    }

    const { subscription, precioFinal } = result;
    const body: IPostSubscriptionResponse = {
      data: {
        subscriptionId: subscription.id,
        userId: subscription.userId,
        planId: subscription.planId,
        fechaInicio: subscription.fechaInicio.toISOString().split('T')[0],
        fechaFin: subscription.fechaFin.toISOString().split('T')[0],
        descuentoAplicado: Number(subscription.descuentoAplicado),
        precioFinal: Math.round(precioFinal),
      },
      statusCode: 201,
      statusDescription: 'Suscripción creada exitosamente',
      errors: null,
    };

    return response.status(201).json(body);
  }

  // HU18 — Ver estado del plan activo del usuario
  @ApiOperation({ summary: 'Ver estado del plan activo de un usuario' })
  @Get('user/:userId/status')
  async getSubscriptionStatus(
    @Param('userId', ParseIntPipe) userId: number,
    @Res() response: Response,
  ): Promise<Response> {
    const result = await this.subscriptionsService.getEstadoPlan(userId);

    if (!result) {
      return response.status(404).json({ message: 'No hay suscripción activa para este usuario' });
    }

    const { subscription, plan, consumosDisponibles, precioFinal } = result;
    const body: IGetSubscriptionStatusResponse = {
      subscriptionId: subscription.id,
      activa: subscription.activa,
      plan: {
        id: plan.id,
        nombre: plan.nombre,
        descripcion: plan.descripcion,
        precio: Number(plan.precio),
        tipo: plan.tipo,
      },
      fechaInicio: subscription.fechaInicio.toISOString().split('T')[0],
      fechaFin: subscription.fechaFin.toISOString().split('T')[0],
      consumosUsados: subscription.consumosUsados,
      consumosDisponibles,
      descuentoAplicado: Number(subscription.descuentoAplicado),
      precioFinal: Math.round(precioFinal),
    };

    return response.status(200).json(body);
  }

  // HU19 — Obtener el porcentaje de descuento según perfil del usuario
  @ApiOperation({ summary: 'Calcular descuento por perfil de usuario (estudiante activo)' })
  @Get('discount/:tipoUsuario')
  getDiscount(@Param('tipoUsuario') tipoUsuario: string) {
    const porcentaje = this.subscriptionsService.calcularDescuento(tipoUsuario);
    return {
      tipoUsuario,
      descuentoPorcentaje: porcentaje * 100,
      descripcion: porcentaje > 0
        ? `El perfil "${tipoUsuario}" recibe un ${porcentaje * 100}% de descuento`
        : `El perfil "${tipoUsuario}" no tiene descuento adicional`,
    };
  }

  // Registrar uso de una comida del plan
  @ApiOperation({ summary: 'Registrar consumo de una comida del plan activo' })
  @Post('user/:userId/consume')
  async consumeMeal(
    @Param('userId', ParseIntPipe) userId: number,
    @Res() response: Response,
  ): Promise<Response> {
    const result = await this.subscriptionsService.registrarConsumo(userId);

    if (!result) {
      return response.status(400).json({
        message: 'No hay suscripción activa o se agotaron los consumos del plan',
      });
    }

    return response.status(200).json({
      consumosUsados: result.consumosUsados,
      message: 'Consumo registrado exitosamente',
    });
  }
}
