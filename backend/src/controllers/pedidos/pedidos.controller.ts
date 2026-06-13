import { Controller, Get, Post, Put, Delete, Param, Body, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { IPostPedidoRequest } from './dto/IPostPedidoRequest';
import type { IPostPedidoResponse } from './dto/IPostPedidoResponse';
import { IPutPedidoRequest } from './dto/IPutPedidoRequest';
import { PedidosService } from 'src/providers/pedidos/pedidos.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AdminGuard } from 'src/common/guards/admin.guard';

@ApiTags('Pedidos')
@Controller('orders')
export class PedidosController {

  constructor(private readonly pedidosService: PedidosService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todos los pedidos' })
  @UseGuards(AdminGuard)
  @Get()
  public async getPedidos() {
    return await this.pedidosService.getAll();
  }

  @ApiOperation({ summary: 'Consultar descuento aplicable para un usuario' })
  @Get('discount/:usuarioId')
  async getDescuento(@Param('usuarioId') usuarioId: number) {
    return await this.pedidosService.getDescuentoPerfil(Number(usuarioId));
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener un pedido por id' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  public async getPedido(@Param('id') id: number) {
    return await this.pedidosService.getOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener pedidos de un usuario' })
  @UseGuards(JwtAuthGuard)
  @Get('user/:usuarioId')
  public async getPedidosPorUsuario(@Param('usuarioId') usuarioId: number) {
    return await this.pedidosService.getByUser(Number(usuarioId));
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un nuevo pedido' })
  @UseGuards(JwtAuthGuard)
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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un pedido' })
  @UseGuards(AdminGuard)
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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un pedido' })
  @UseGuards(AdminGuard)
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
