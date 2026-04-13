import { Controller, Get, Post, Put, Delete, Param, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import type { IGetStockResponse } from './dto/IGetStockResponse';
import type { IPostStockRequest } from './dto/IPostStockRequest';
import type { IPostStockResponse } from './dto/IPostStockResponse';
import type { IPutStockRequest } from './dto/IPutStockRequest';

@Controller('stock')
export class StockController {

  private stocks: IGetStockResponse[] = [];

  @Get()
  public getStocks(): IGetStockResponse[] {
    return this.stocks;
  }

  @Get(':id')
  public getStock(@Param('id') id: number): IGetStockResponse | undefined {
    return this.stocks.find(e => e.id == id);
  }

  @Post()
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
      const newStock: IGetStockResponse = {
        id: this.stocks.length + 1,
        menuItemId: request.menuItemId,
        cantidad: request.cantidad,
        umbralMinimo: request.umbralMinimo,
        ultimaActualizacion: new Date(),
      };
      this.stocks.push(newStock);
    }

    return response;
  }

  @Put(':id')
  async putStock(
    @Param('id') id: number,
    @Body() request: IPutStockRequest,
    @Res() response: Response,
  ): Promise<Response> {
    if (isNaN(id)) return response.status(400).send();

    this.stocks.find((stock) => {
      if (stock.id == id) {
        stock.cantidad = request?.cantidad ?? stock.cantidad;
        stock.umbralMinimo = request?.umbralMinimo ?? stock.umbralMinimo;
        stock.ultimaActualizacion = new Date();
      }
    });

    return response.status(202).send();
  }

  @Delete(':id')
  async deleteStock(
    @Param('id') id: number,
    @Res() response: Response,
  ): Promise<Response> {
    if (isNaN(id)) return response.status(400).send();

    let found = false;

    this.stocks = this.stocks.filter((stock) => {
      if (stock.id == id) {
        found = true;
        return false;
      }
      return true;
    });

    if (!found) return response.status(404).send();

    return response.status(200).send();
  }
}