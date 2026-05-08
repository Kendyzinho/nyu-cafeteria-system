import { Controller, Get, Post, Put, Delete, Param, Body, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import type { IPostPromotionRequest } from './dto/IPostPromotionRequest';
import type { IPostPromotionResponse } from './dto/IPostPromotionResponse';
import type { IPutPromotionRequest } from './dto/IPutPromotionRequest';
import { PromotionsService } from 'src/providers/promotions/promotions.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { USER_ROLES } from 'src/auth/constants/roles.constant';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Promotions')
@ApiBearerAuth('jwt-auth')
@Controller('promotions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PromotionsController {

  constructor(private readonly promotionsService: PromotionsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener promociones' })
  public async getPromotions() {
    return await this.promotionsService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener promoción por id' })
  public async getPromotion(@Param('id') id: number) {
    return await this.promotionsService.getOne(id);
  }

  @Roles(USER_ROLES.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Crear promoción (solo admin)' })
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

  @Roles(USER_ROLES.ADMIN)
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar promoción (solo admin)' })
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

  @Roles(USER_ROLES.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar promoción (solo admin)' })
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
