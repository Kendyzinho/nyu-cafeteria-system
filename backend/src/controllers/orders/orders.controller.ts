import { Controller, Get, Post, Put, Delete, Param, Body, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { OrdersService } from 'src/providers/orders/orders.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  public async getOrders() {
    return await this.ordersService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('history/:usuarioId')
  public async getHistory(@Param('usuarioId') usuarioId: number) {
    return await this.ordersService.getHistory(Number(usuarioId));
  }

  @Get(':id')
  public async getOrder(@Param('id') id: number) {
    return await this.ordersService.getOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('calculate')
  async calculateOrder(@Body() request: { usuarioId: number, items: any[], fechaRetiro?: string }) {
    return await this.ordersService.calculate(request);
  }

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  async checkoutOrder(@Body() request: { usuarioId: number, items: any[], fechaRetiro?: string }) {
    return await this.ordersService.checkout(request);
  }

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