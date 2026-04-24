import { Controller, Get, Post, Put, Delete, Param, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import type { IPostPromotionRequest } from './dto/IPostPromotionRequest';
import type { IPostPromotionResponse } from './dto/IPostPromotionResponse';
import type { IPutPromotionRequest } from './dto/IPutPromotionRequest';
import { PromotionsService } from 'src/providers/promotions/promotions.service';

@Controller('promotions')
export class PromotionsController {

  constructor(private readonly promotionsService: PromotionsService) {}

  @Get()
  public async getPromotions() {
    return await this.promotionsService.getAll();
  }

  @Get(':id')
  public async getPromotion(@Param('id') id: number) {
    return await this.promotionsService.getOne(id);
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
      await this.promotionsService.create(request);
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

    const result = await this.promotionsService.update(id, request);

    if (!result) return response.status(404).send();

    return response.status(202).send();
  }

  @Delete(':id')
  async deletePromotion(
    @Param('id') id: number,
    @Res() response: Response,
  ): Promise<Response> {
    if (isNaN(id)) return response.status(400).send();

    const result = await this.promotionsService.delete(id);

    if (!result) return response.status(404).send();

    return response.status(200).send();
  }
}