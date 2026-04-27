import { Controller, Get, Post, Put, Delete, Param, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import type { IPostMenuRequest } from './dto/IPostMenuRequest';
import type { IPostMenuResponse } from './dto/IPostMenuResponse';
import type { IPutMenuRequest } from './dto/IPutMenuRequest';
import { MenuService } from 'src/providers/menu/menu.service';

@Controller('menu') // define la ruta base: /api/menu
export class MenuController {

  // inyecta el Provider para delegar la lógica de negocio
  constructor(private readonly menuService: MenuService) {}

  @Get() // GET /api/menu — retorna todos los ítems
  public async getMenuItems() {
    return await this.menuService.getAll();
  }

  @Get(':id') // GET /api/menu/:id — retorna un ítem por id
  public async getMenuItem(@Param('id') id: number) {
    return await this.menuService.getOne(id);
  }

  @Post() // POST /api/menu — crea un nuevo ítem
  async postMenuItem(
    @Body() request: IPostMenuRequest // ValidationPipe valida los datos automáticamente
  ): Promise<IPostMenuResponse> {
    const response: IPostMenuResponse = {
      data: null,
      statusCode: 200,
      statusDescription: 'Item agregado',
      errors: null,
    };

    if (request) {
      await this.menuService.create(request); // delega la creación al Provider
    }

    return response;
  }

  @Put(':id') // PUT /api/menu/:id — actualiza un ítem existente
  async putMenuItem(
    @Param('id') id: number,
    @Body() request: IPutMenuRequest,
    @Res() response: Response,
  ): Promise<Response> {
    if (isNaN(id)) return response.status(400).send(); // id inválido

    const result = await this.menuService.update(id, request);

    if (!result) return response.status(404).send(); // ítem no encontrado

    return response.status(202).send(); // actualizado exitosamente
  }

  @Delete(':id') // DELETE /api/menu/:id — elimina un ítem
  async deleteMenuItem(
    @Param('id') id: number,
    @Res() response: Response,
  ): Promise<Response> {
    if (isNaN(id)) return response.status(400).send(); // id inválido

    const result = await this.menuService.delete(id);

    if (!result) return response.status(404).send(); // ítem no encontrado

    return response.status(200).send(); // eliminado exitosamente
  }
}