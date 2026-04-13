import { Controller, Get, Post, Put, Delete, Param, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import type { IGetUserResponse } from './dto/IGetUserResponse';
import type { IPostUserRequest } from './dto/IPostUserRequest';
import type { IPostUserResponse } from './dto/IPostUserResponse';
import type { IPutUserRequest } from './dto/IPutUserRequest';

@Controller('users')
export class UsersController {

  private users: IGetUserResponse[] = [];

  @Get()
  public getUsers(): IGetUserResponse[] {
    return this.users;
  }

  @Get(':id')
  public getUser(@Param('id') id: number): IGetUserResponse | undefined {
    return this.users.find(e => e.id == id);
  }

  @Post()
  async postUser(
    @Body() request: IPostUserRequest
  ): Promise<IPostUserResponse> {
    const response: IPostUserResponse = {
      data: null,
      statusCode: 200,
      statusDescription: 'Usuario creado',
      errors: null,
    };

    if (request) {
      const newUser: IGetUserResponse = {
        id: this.users.length + 1,
        nombre: request.nombre,
        apellido: request.apellido,
        email: request.email,
        tipo: request.tipo,
        planId: null,
      };
      this.users.push(newUser);
    }

    return response;
  }

  @Put(':id')
  async putUser(
    @Param('id') id: number,
    @Body() request: IPutUserRequest,
    @Res() response: Response,
  ): Promise<Response> {
    if (isNaN(id)) return response.status(400).send();

    this.users.find((user) => {
      if (user.id == id) {
        user.nombre = request?.nombre ?? user.nombre;
        user.apellido = request?.apellido ?? user.apellido;
        user.email = request?.email ?? user.email;
        user.tipo = request?.tipo ?? user.tipo;
        user.planId = request?.planId ?? user.planId;
      }
    });

    return response.status(202).send();
  }

  @Delete(':id')
  async deleteUser(
    @Param('id') id: number,
    @Res() response: Response,
  ): Promise<Response> {
    if (isNaN(id)) return response.status(400).send();

    let found = false;

    this.users = this.users.filter((user) => {
      if (user.id == id) {
        found = true;
        return false;
      }
      return true;
    });

    if (!found) return response.status(404).send();

    return response.status(200).send();
  }
}