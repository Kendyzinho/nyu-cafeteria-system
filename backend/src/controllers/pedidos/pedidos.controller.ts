import { Controller, Get, Post, Put, Delete, Param, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { IPostPedidoRequest } from './dto/IPostPedidoRequest';
import type { IPostPedidoResponse } from './dto/IPostPedidoResponse';
import { IPutPedidoRequest } from './dto/IPutPedidoRequest';
import { PedidosService } from 'src/providers/pedidos/pedidos.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Pedidos')
@Controller('orders')
export class PedidosController {

  constructor(private readonly pedidosService: PedidosService) {}

  @ApiOperation({ summary: 'Obtener todos los pedidos' })
  @Get()
  public async getPedidos() {
    return await this.pedidosService.getAll();
  }

  @ApiOperation({ summary: 'Obtener un pedido por id' })
  @Get(':id')
  public async getPedido(@Param('id') id: number) {
    return await this.pedidosService.getOne(id);
  }

  @ApiOperation({ summary: 'Obtener pedidos de un usuario' })
  @Get('user/:usuarioId')
  public async getPedidosPorUsuario(@Param('usuarioId') usuarioId: number) {
    return await this.pedidosService.getByUser(Number(usuarioId));
  }

  @ApiOperation({ summary: 'Crear un nuevo pedido' })
  @Post()
  async postPedido(
    @Body() request: IPostPedidoRequest
  ): Promise<IPostPedidoResponse> {
    const response: IPostPedidoResponse = {
      data: null,
      statusCode: 200,
      statusDescription: 'Pedido creado',
      errors: null,
    };

    if (request) {
      await this.pedidosService.create(request);
    }

    return response;
  }

  @ApiOperation({ summary: 'Actualizar un pedido' })
  @Put(':id')
  async putPedido(
    @Param('id') id: number,
    @Body() request: IPutPedidoRequest,
    @Res() response: Response,
  ): Promise<Response> {
    if (isNaN(id)) return response.status(400).send();
    const result = await this.pedidosService.update(id, request);
    if (!result) return response.status(404).send();
    return response.status(202).send();
  }

  @ApiOperation({ summary: 'Eliminar un pedido' })
  @Delete(':id')
  async deletePedido(
    @Param('id') id: number,
    @Res() response: Response,
  ): Promise<Response> {
    if (isNaN(id)) return response.status(400).send();
    const result = await this.pedidosService.delete(id);
    if (!result) return response.status(404).send();
    return response.status(200).send();
  }
}
