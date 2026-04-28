import { Controller, Get, Post, Put, Delete, Param, Body, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { IPostPromotionRequest } from './dto/IPostPromotionRequest';
import type { IPostPromotionResponse } from './dto/IPostPromotionResponse';
import { IPutPromotionRequest } from './dto/IPutPromotionRequest';
import { PromotionsService } from 'src/providers/promotions/promotions.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@ApiTags('Promotions')
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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
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