import { Controller, Get, Post, Put, Delete, Param, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import type { IPostPromocionRequest } from './dto/IPostPromocionRequest';
import type { IPostPromocionResponse } from './dto/IPostPromocionResponse';
import type { IPutPromocionRequest } from './dto/IPutPromocionRequest';
import { PromocionesService } from 'src/providers/promociones/promociones.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Promociones')
@Controller('promotions')
export class PromocionesController {

  constructor(private readonly promocionesService: PromocionesService) {}

  @ApiOperation({ summary: 'Obtener todas las promociones' })
  @Get()
  public async getPromociones() {
    return await this.promocionesService.getAll();
  }

  @ApiOperation({ summary: 'Obtener una promoción por id' })
  @Get(':id')
  public async getPromocion(@Param('id') id: number) {
    return await this.promocionesService.getOne(id);
  }

  @ApiOperation({ summary: 'Crear una nueva promoción' })
  @Post()
  async postPromocion(
    @Body() request: IPostPromocionRequest
  ): Promise<IPostPromocionResponse> {
    const response: IPostPromocionResponse = {
      data: null,
      statusCode: 200,
      statusDescription: 'Promoción creada',
      errors: null,
    };

    if (request) {
      await this.promocionesService.create(request);
    }

    return response;
  }

  @ApiOperation({ summary: 'Actualizar una promoción' })
  @Put(':id')
  async putPromocion(
    @Param('id') id: number,
    @Body() request: IPutPromocionRequest,
    @Res() response: Response,
  ): Promise<Response> {
    if (isNaN(id)) return response.status(400).send();
    const result = await this.promocionesService.update(id, request);
    if (!result) return response.status(404).send();
    return response.status(202).send();
  }

  @ApiOperation({ summary: 'Eliminar una promoción' })
  @Delete(':id')
  async deletePromocion(
    @Param('id') id: number,
    @Res() response: Response,
  ): Promise<Response> {
    if (isNaN(id)) return response.status(400).send();
    const result = await this.promocionesService.delete(id);
    if (!result) return response.status(404).send();
    return response.status(200).send();
  }
}
