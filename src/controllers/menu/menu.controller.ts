import { Controller, Get, Post, Put, Delete, Param, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import type { IGetMenuResponse } from './dto/IGetMenuResponse';
import type { IPostMenuRequest } from './dto/IPostMenuRequest';
import type { IPostMenuResponse } from './dto/IPostMenuResponse';
import type { IPutMenuRequest } from './dto/IPutMenuRequest';

@Controller('menu')
export class MenuController {

  private items: IGetMenuResponse[] = [
    {
      id: 1,
      nombre: 'Almuerzo Completo',
      descripcion: 'Sopa, segundo y postre',
      precio: 3500,
      categoria: 'almuerzo',
      disponible: true,
      stockActual: 50,
      fechaDisponible: new Date(),
    }
  ];

  @Get()
  public getMenuItems(): IGetMenuResponse[] {
    return this.items;
  }

  @Get(':id')
public getMenuItem(@Param('id') id: number): IGetMenuResponse | undefined {
  const item = this.items.find(e => e.id == id);
  return item;
}

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
      const newItem: IGetMenuResponse = {
        id: this.items.length + 1,
        nombre: request.nombre,
        descripcion: request.descripcion,
        precio: request.precio,
        categoria: request.categoria,
        disponible: true,
        stockActual: request.stockActual,
        fechaDisponible: request.fechaDisponible,
      };
      this.items.push(newItem);
    }

    return response;
  }

  @Put(':id')
  async putMenuItem(
    @Param('id') id: number,
    @Body() request: IPutMenuRequest,
    @Res() response: Response,
  ): Promise<Response> {
    if (isNaN(id)) return response.status(400).send();

    this.items.find((item) => {
      if (item.id == id) {
        item.nombre = request?.nombre ?? item.nombre;
        item.descripcion = request?.descripcion ?? item.descripcion;
        item.precio = request?.precio ?? item.precio;
        item.categoria = request?.categoria ?? item.categoria;
        item.disponible = request?.disponible ?? item.disponible;
        item.stockActual = request?.stockActual ?? item.stockActual;
        item.fechaDisponible = request?.fechaDisponible ?? item.fechaDisponible;
      }
    });

    return response.status(202).send();
  }

  @Delete(':id')
  async deleteMenuItem(
    @Param('id') id: number,
    @Res() response: Response,
  ): Promise<Response> {
    if (isNaN(id)) return response.status(400).send();

    let found = false;

    this.items = this.items.filter((item) => {
      if (item.id == id) {
        found = true;
        return false;
      }
      return true;
    });

    if (!found) return response.status(404).send();

    return response.status(200).send();
  }
}