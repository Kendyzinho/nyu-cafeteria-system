import { Controller, Get, Post, Put, Delete, Param, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import type { IPostPlanComidaRequest } from './dto/IPostPlanComidaRequest';
import type { IPostPlanComidaResponse } from './dto/IPostPlanComidaResponse';
import type { IPutPlanComidaRequest } from './dto/IPutPlanComidaRequest';
import { PlanesComidaService } from 'src/providers/planes-comida/planes-comida.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Planes de Comida')
@Controller('meal-plans')
export class PlanesComidaController {

  constructor(private readonly planesComidaService: PlanesComidaService) {}

  @ApiOperation({ summary: 'Obtener todos los planes' })
  @Get()
  public async getPlanesComida() {
    return await this.planesComidaService.getAll();
  }

  @ApiOperation({ summary: 'Obtener un plan por id' })
  @Get(':id')
  public async getPlanComida(@Param('id') id: number) {
    return await this.planesComidaService.getOne(id);
  }

  @ApiOperation({ summary: 'Crear un nuevo plan' })
  @Post()
  async postPlanComida(
    @Body() request: IPostPlanComidaRequest
  ): Promise<IPostPlanComidaResponse> {
    try {
      const createdPlan = await this.planesComidaService.create(request);
      return {
        data: createdPlan as any,
        statusCode: 201,
        statusDescription: 'Plan de alimentación creado exitosamente',
        errors: null,
      };
    } catch (error: any) {
      return {
        data: null,
        statusCode: 500,
        statusDescription: 'Error al crear el plan en la base de datos',
        errors: error.message,
      };
    }
  }

  @ApiOperation({ summary: 'Actualizar un plan' })
  @Put(':id')
  async putPlanComida(
    @Param('id') id: number,
    @Body() request: IPutPlanComidaRequest,
    @Res() response: Response,
  ): Promise<Response> {
    if (isNaN(id)) return response.status(400).send();
    const result = await this.planesComidaService.update(id, request);
    if (!result) return response.status(404).send();
    return response.status(202).send();
  }

  @ApiOperation({ summary: 'Eliminar un plan' })
  @Delete(':id')
  async deletePlanComida(
    @Param('id') id: number,
    @Res() response: Response,
  ): Promise<Response> {
    if (isNaN(id)) return response.status(400).send();
    const result = await this.planesComidaService.delete(id);
    if (!result) return response.status(404).send();
    return response.status(200).send();
  }
}
