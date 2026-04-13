import { Controller, Get, Post, Put, Delete, Param, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import type { IGetPromotionResponse } from './dto/IGetPromotionResponse';
import type { IPostPromotionRequest } from './dto/IPostPromotionRequest';
import type { IPostPromotionResponse } from './dto/IPostPromotionResponse';
import type { IPutPromotionRequest } from './dto/IPutPromotionRequest';

@Controller('promotions')
export class PromotionsController {

  private promotions: IGetPromotionResponse[] = [];

  @Get()
  public getPromotions(): IGetPromotionResponse[] {
    return this.promotions;
  }

  @Get(':id')
  public getPromotion(@Param('id') id: number): IGetPromotionResponse | undefined {
    return this.promotions.find(e => e.id == id);
  }

  @Post()
  async postPromotion(
    @Body() request: IPostPromotionRequest
  ): Promise<IPostPromotionResponse> {
    const response: IPostPromotionResponse = {
      data: null,
      statusCode: 200,
      statusDescription: 'Promoción creada',
      errors: null,
    };

    if (request) {
      const newPromotion: IGetPromotionResponse = {
        id: this.promotions.length + 1,
        nombre: request.nombre,
        descripcion: request.descripcion,
        descuento: request.descuento,
        fechaInicio: request.fechaInicio,
        fechaFin: request.fechaFin,
        activa: true,
      };
      this.promotions.push(newPromotion);
    }

    return response;
  }

  @Put(':id')
  async putPromotion(
    @Param('id') id: number,
    @Body() request: IPutPromotionRequest,
    @Res() response: Response,
  ): Promise<Response> {
    if (isNaN(id)) return response.status(400).send();

    this.promotions.find((promotion) => {
      if (promotion.id == id) {
        promotion.nombre = request?.nombre ?? promotion.nombre;
        promotion.descripcion = request?.descripcion ?? promotion.descripcion;
        promotion.descuento = request?.descuento ?? promotion.descuento;
        promotion.fechaInicio = request?.fechaInicio ?? promotion.fechaInicio;
        promotion.fechaFin = request?.fechaFin ?? promotion.fechaFin;
        promotion.activa = request?.activa ?? promotion.activa;
      }
    });

    return response.status(202).send();
  }

  @Delete(':id')
  async deletePromotion(
    @Param('id') id: number,
    @Res() response: Response,
  ): Promise<Response> {
    if (isNaN(id)) return response.status(400).send();

    let found = false;

    this.promotions = this.promotions.filter((promotion) => {
      if (promotion.id == id) {
        found = true;
        return false;
      }
      return true;
    });

    if (!found) return response.status(404).send();

    return response.status(200).send();
  }
}