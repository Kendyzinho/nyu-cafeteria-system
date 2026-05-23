import { Controller, Get, Post, Put, Delete, Param, Body, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import type { Response } from 'express';
import { IPostMenuRequest } from './dto/IPostMenuRequest';
import type { IPostMenuResponse } from './dto/IPostMenuResponse';
import { IPutMenuRequest } from './dto/IPutMenuRequest';
import { MenuService } from 'src/providers/menu/menu.service';
import { AdminGuard } from 'src/common/guards/admin.guard';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {

  constructor(private readonly menuService: MenuService) {}

  @ApiOperation({ summary: 'Obtener todos los ítems del menú' })
  @ApiResponse({ status: 200, description: 'Lista de ítems del menú' })
  @Get()
  public async getMenuItems() {
    return await this.menuService.getAll();
  }

  @ApiOperation({ summary: 'Obtener un ítem del menú por id' })
  @ApiResponse({ status: 200, description: 'Ítem encontrado' })
  @ApiResponse({ status: 404, description: 'Ítem no encontrado' })
  @Get(':id')
  public async getMenuItem(@Param('id') id: number) {
    return await this.menuService.getOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un nuevo ítem del menú (solo Admin)' })
  @ApiBody({ type: IPostMenuRequest })
  @ApiResponse({ status: 200, description: 'Ítem creado exitosamente' })
  @ApiResponse({ status: 401, description: 'Token requerido' })
  @ApiResponse({ status: 403, description: 'Acceso restringido a administradores' })
  @UseGuards(AdminGuard)
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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un ítem del menú (solo Admin)' })
  @ApiBody({ type: IPutMenuRequest })
  @ApiResponse({ status: 202, description: 'Ítem actualizado' })
  @ApiResponse({ status: 401, description: 'Token requerido' })
  @ApiResponse({ status: 403, description: 'Acceso restringido a administradores' })
  @ApiResponse({ status: 404, description: 'Ítem no encontrado' })
  @UseGuards(AdminGuard)
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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un ítem del menú (solo Admin)' })
  @ApiResponse({ status: 200, description: 'Ítem eliminado' })
  @ApiResponse({ status: 401, description: 'Token requerido' })
  @ApiResponse({ status: 403, description: 'Acceso restringido a administradores' })
  @ApiResponse({ status: 404, description: 'Ítem no encontrado' })
  @UseGuards(AdminGuard)
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
