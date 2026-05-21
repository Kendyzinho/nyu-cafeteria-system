import { Controller, Get, Post, Put, Delete, Param, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import type { IPostUsuarioRequest } from './dto/IPostUsuarioRequest';
import type { IPostUsuarioResponse } from './dto/IPostUsuarioResponse';
import type { IPutUsuarioRequest } from './dto/IPutUsuarioRequest';
import { UsuariosService } from 'src/providers/usuarios/usuarios.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Usuarios')
@Controller('users')
export class UsuariosController {

  constructor(private readonly usuariosService: UsuariosService) {}

  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @Get()
  public async getUsuarios() {
    return await this.usuariosService.getAll();
  }

  @ApiOperation({ summary: 'Obtener un usuario por id' })
  @Get(':id')
  public async getUsuario(@Param('id') id: number) {
    return await this.usuariosService.getOne(id);
  }

  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @Post()
  async postUsuario(
    @Body() request: IPostUsuarioRequest
  ): Promise<IPostUsuarioResponse> {
    const response: IPostUsuarioResponse = {
      data: null,
      statusCode: 200,
      statusDescription: 'Usuario creado',
      errors: null,
    };

    if (request) {
      await this.usuariosService.create(request);
    }

    return response;
  }

  @ApiOperation({ summary: 'Actualizar un usuario' })
  @Put(':id')
  async putUsuario(
    @Param('id') id: number,
    @Body() request: IPutUsuarioRequest,
    @Res() response: Response,
  ): Promise<Response> {
    if (isNaN(id)) return response.status(400).send();
    const result = await this.usuariosService.update(id, request);
    if (!result) return response.status(404).send();
    return response.status(202).send();
  }

  @ApiOperation({ summary: 'Eliminar un usuario' })
  @Delete(':id')
  async deleteUsuario(
    @Param('id') id: number,
    @Res() response: Response,
  ): Promise<Response> {
    if (isNaN(id)) return response.status(400).send();
    const result = await this.usuariosService.delete(id);
    if (!result) return response.status(404).send();
    return response.status(200).send();
  }
}
