import { Controller, Post, Body, Res, BadRequestException } from '@nestjs/common';
import type { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PagosService } from '../../providers/pagos/pagos.service';
import { IPostPagoRequest } from './dto/IPostPagoRequest';

@ApiTags('Pagos')
@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @ApiOperation({
    summary: 'HU15 - Procesar pago (simulación Equipo 5)',
    description: 'Simula la pasarela de pagos. Cuando Equipo 5 esté disponible, cambiar apiPagosUrl en environment.ts.',
  })
  @ApiResponse({ status: 200, schema: { example: { status: 'APPROVED', transactionId: 7 } } })
  @Post('procesar')
  async procesarPago(
    @Body() body: IPostPagoRequest,
    @Res() response: Response,
  ): Promise<Response> {
    if (!body.email || body.monto === undefined) {
      throw new BadRequestException('email and monto are required');
    }

    const payload = {
      email: body.email,
      monto: body.monto,
      datosTarjeta: body.datosTarjeta,
    };

    const result = await this.pagosService.procesarPago(payload);
    return response.status(200).json(result);
  }
}