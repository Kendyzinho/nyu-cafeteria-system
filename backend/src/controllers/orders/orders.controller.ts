import { Controller, Get, Post, Put, Delete, Param, Body, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { OrdersService } from 'src/providers/orders/orders.service';
import { ICheckoutRequest } from './dto/ICheckoutRequest';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  public async getOrders() {
    return await this.ordersService.getAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('history/:usuarioId')
  public async getHistory(@Param('usuarioId') usuarioId: number) {
    return await this.ordersService.getHistory(Number(usuarioId));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get(':id')
  public async getOrder(@Param('id') id: number) {
    return await this.ordersService.getOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('calculate')
  async calculateOrder(@Body() request: ICheckoutRequest) {
    return await this.ordersService.calculate(request);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  async checkoutOrder(@Body() request: ICheckoutRequest) {
    return await this.ordersService.checkout(request);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
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