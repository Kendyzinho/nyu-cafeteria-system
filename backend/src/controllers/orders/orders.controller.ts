import { Controller, Get, Post, Put, Delete, Param, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import type { IPostOrderRequest } from './dto/IPostOrderRequest';
import type { IPostOrderResponse } from './dto/IPostOrderResponse';
import type { IPutOrderRequest } from './dto/IPutOrderRequest';
import { OrdersService } from 'src/providers/orders/orders.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {

  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Obtener todas las órdenes' })
  @Get()
  public async getOrders() {
    return await this.ordersService.getAll();
  }

  @ApiOperation({ summary: 'Obtener una orden por id' })
  @Get(':id')
  public async getOrder(@Param('id') id: number) {
    return await this.ordersService.getOne(id);
  }

  @ApiOperation({ summary: 'Crear una nueva orden' })
  @Post()
  async postOrder(
    @Body() request: IPostOrderRequest
  ): Promise<IPostOrderResponse> {
    const response: IPostOrderResponse = {
      data: null,
      statusCode: 200,
      statusDescription: 'Orden creada',
      errors: null,
    };

    if (request) {
      await this.ordersService.create(request);
    }

    return response;
  }

  @ApiOperation({ summary: 'Actualizar una orden' })
  @Put(':id')
  async putOrder(
    @Param('id') id: number,
    @Body() request: IPutOrderRequest,
    @Res() response: Response,
  ): Promise<Response> {
    if (isNaN(id)) return response.status(400).send();

    const result = await this.ordersService.update(id, request);

    if (!result) return response.status(404).send();

    return response.status(202).send();
  }

  @ApiOperation({ summary: 'Eliminar una orden' })
  @Delete(':id')
  async deleteOrder(
    @Param('id') id: number,
    @Res() response: Response,
  ): Promise<Response> {
    if (isNaN(id)) return response.status(400).send();

    const result = await this.ordersService.delete(id);

    if (!result) return response.status(404).send();

    return response.status(200).send();
  }
}

