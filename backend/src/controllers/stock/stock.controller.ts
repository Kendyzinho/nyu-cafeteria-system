import { Controller, Get, Post, Put, Delete, Param, Body, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import type { IPostStockRequest } from './dto/IPostStockRequest';
import type { IPostStockResponse } from './dto/IPostStockResponse';
import type { IPutStockRequest } from './dto/IPutStockRequest';
import { StockService } from 'src/providers/stock/stock.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { USER_ROLES } from 'src/auth/constants/roles.constant';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Stock')
@ApiBearerAuth('jwt-auth')
@Controller('stock')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StockController {

  constructor(private readonly stockService: StockService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener registros de stock' })
  public async getStocks() {
    return await this.stockService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un registro de stock por id' })
  public async getStock(@Param('id') id: number) {
    return await this.stockService.getOne(id);
  }

  @Roles(USER_ROLES.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Crear registro de stock (solo admin)' })
  async postStock(
    @Body() request: IPostStockRequest
  ): Promise<IPostStockResponse> {
    const response: IPostStockResponse = {
      data: null,
      statusCode: 200,
      statusDescription: 'Stock creado',
      errors: null,
    };

    if (request) {
      await this.stockService.create(request);
    }

    return response;
  }

  @Roles(USER_ROLES.ADMIN)
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar stock (solo admin)' })
  async putStock(
    @Param('id') id: number,
    @Body() request: IPutStockRequest,
    @Res() response: Response,
  ): Promise<Response> {
    if (isNaN(id)) return response.status(400).send();

    const result = await this.stockService.update(id, request);

    if (!result) return response.status(404).send();

    return response.status(202).send();
  }

  @Roles(USER_ROLES.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar stock (solo admin)' })
  async deleteStock(
    @Param('id') id: number,
    @Res() response: Response,
  ): Promise<Response> {
    if (isNaN(id)) return response.status(400).send();

    const result = await this.stockService.delete(id);

    if (!result) return response.status(404).send();

    return response.status(200).send();
  }
}
