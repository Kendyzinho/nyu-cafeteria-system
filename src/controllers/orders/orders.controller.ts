import { Controller, Get, Post, Put, Delete, Param, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import type { IGetOrderResponse } from './dto/IGetOrderResponse';
import type { IPostOrderRequest } from './dto/IPostOrderRequest';
import type { IPostOrderResponse } from './dto/IPostOrderResponse';
import type { IPutOrderRequest } from './dto/IPutOrderRequest';

@Controller('orders')
export class OrdersController {

  private orders: IGetOrderResponse[] = [];

  @Get()
  public getOrders(): IGetOrderResponse[] {
    return this.orders;
  }

  @Get(':id')
  public getOrder(@Param('id') id: number): IGetOrderResponse | undefined {
    return this.orders.find(e => e.id == id);
  }

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
      const newOrder: IGetOrderResponse = {
        id: this.orders.length + 1,
        usuarioId: request.usuarioId,
        items: request.items,
        total: 0,
        estado: 'pendiente',
        fechaCreacion: new Date(),
      };
      this.orders.push(newOrder);
    }

    return response;
  }

  @Put(':id')
  async putOrder(
    @Param('id') id: number,
    @Body() request: IPutOrderRequest,
    @Res() response: Response,
  ): Promise<Response> {
    if (isNaN(id)) return response.status(400).send();

    this.orders.find((order) => {
      if (order.id == id) {
        order.estado = request?.estado ?? order.estado;
        order.items = request?.items ?? order.items;
      }
    });

    return response.status(202).send();
  }

  @Delete(':id')
  async deleteOrder(
    @Param('id') id: number,
    @Res() response: Response,
  ): Promise<Response> {
    if (isNaN(id)) return response.status(400).send();

    let found = false;

    this.orders = this.orders.filter((order) => {
      if (order.id == id) {
        found = true;
        return false;
      }
      return true;
    });

    if (!found) return response.status(404).send();

    return response.status(200).send();
  }
}