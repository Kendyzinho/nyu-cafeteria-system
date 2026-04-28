import { Controller, Get, Post, Put, Delete, Param, Body, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { IPostMenuRequest } from './dto/IPostMenuRequest';
import type { IPostMenuResponse } from './dto/IPostMenuResponse';
import { IPutMenuRequest } from './dto/IPutMenuRequest';
import { MenuService } from 'src/providers/menu/menu.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  public async getMenuItems() {
    return await this.menuService.getAll();
  }

  @Get(':id')
  public async getMenuItem(@Param('id') id: number) {
    return await this.menuService.getOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async postMenuItem(
    @Body() request: IPostMenuRequest
  ): Promise<IPostMenuResponse> {
    const response: IPostMenuResponse = {
      data: null,
      statusCode: 200,
      statusDescription: 'Item agregado',
      errors: null,
    };

    if (request) {
      await this.menuService.create(request);
    }

    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
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