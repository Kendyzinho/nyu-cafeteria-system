import { Controller, Get, Post, Put, Delete, Param, Body, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import type { IPostStockRequest } from './dto/IPostStockRequest';
import type { IPostStockResponse } from './dto/IPostStockResponse';
import { IPutStockRequest } from './dto/IPutStockRequest';
import { StockService } from 'src/providers/stock/stock.service';
import { AdminGuard } from 'src/common/guards/admin.guard';

@Controller('stock')
export class StockController {

  constructor(private readonly stockService: StockService) {}

  @Get()
  public async getStocks() {
    return await this.stockService.getAll();
  }

  @Get(':id')
  public async getStock(@Param('id') id: number) {
    return await this.stockService.getOne(id);
  }

  @Post()
  @UseGuards(AdminGuard)
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

  @Put(':id')
  @UseGuards(AdminGuard)
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

  @Delete(':id')
  @UseGuards(AdminGuard)
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