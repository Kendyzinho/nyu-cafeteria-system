import { Controller, Get, Post, Put, Delete, Param, Body, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { IPostUsuarioRequest } from './dto/IPostUsuarioRequest';
import { IPostUsuarioResponse } from './dto/IPostUsuarioResponse';
import { IPutUsuarioRequest } from './dto/IPutUsuarioRequest';
import { UsuariosService } from 'src/providers/usuarios/usuarios.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminGuard } from 'src/common/guards/admin.guard';

@ApiTags('Usuarios')
@Controller('users')
export class UsuariosController {

  constructor(private readonly usuariosService: UsuariosService) {}

  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Get()
  public async getUsuarios() {
    return await this.usuariosService.getAll();
  }

  @ApiOperation({ summary: 'Obtener un usuario por id' })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
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
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
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
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
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
