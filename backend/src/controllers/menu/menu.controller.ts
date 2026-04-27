import { Controller, Get, Post, Put, Delete, Param, Body, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import type { Response } from 'express';
import type { IPostMenuRequest } from './dto/IPostMenuRequest';
import type { IPostMenuResponse } from './dto/IPostMenuResponse';
import type { IPutMenuRequest } from './dto/IPutMenuRequest';
import { MenuService } from 'src/providers/menu/menu.service';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {

  constructor(private readonly menuService: MenuService) {}

  @ApiOperation({ summary: 'Obtener todos los ítems del menú' })
  @Get()
  public async getMenuItems() {
    return await this.menuService.getAll();
  }

  @ApiOperation({ summary: 'Obtener un ítem del menú por id' })
  @Get(':id')
  public async getMenuItem(@Param('id') id: number) {
    return await this.menuService.getOne(id);
  }

  @ApiOperation({ summary: 'Crear un nuevo ítem del menú' })
  @Post()
  async postMenuItem(@Body() request: IPostMenuRequest): Promise<IPostMenuResponse> {
    const response: IPostMenuResponse = {
      data: null,
      statusCode: 200,
      statusDescription: 'Item agregado',
      errors: null,
    };
    if (request) await this.menuService.create(request);
    return response;
  }

  @ApiOperation({ summary: 'Actualizar un ítem del menú' })
  @Put(':id')
  async putMenuItem(
    @Param('id') id: number,
    @Body() request: IPutMenuRequest,
    @Res() response: Response,
  ): Promise<Response> {
    if (isNaN(id)) return response.status(400).send();
    const result = await this.menuService.update(id, request);
    if (!result) return response.status(404).send();
    return response.status(202).send();
  }

  @ApiOperation({ summary: 'Eliminar un ítem del menú' })
  @Delete(':id')
  async deleteMenuItem(
    @Param('id') id: number,
    @Res() response: Response,
  ): Promise<Response> {
    if (isNaN(id)) return response.status(400).send();
    const result = await this.menuService.delete(id);
    if (!result) return response.status(404).send();
    return response.status(200).send();
  }
}