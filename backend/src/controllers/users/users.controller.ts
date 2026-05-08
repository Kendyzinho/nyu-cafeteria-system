import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import type { IPostUserRequest } from './dto/IPostUserRequest';
import type { IPostUserResponse } from './dto/IPostUserResponse';
import type { IPutUserRequest } from './dto/IPutUserRequest';
import { UsersService } from 'src/providers/users/users.service';
import { AuthService } from 'src/providers/auth/auth.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { USER_ROLES } from 'src/auth/constants/roles.constant';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { AuthUser } from 'src/auth/interfaces/auth-user.interface';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth('jwt-auth')
@ApiUnauthorizedResponse({ description: 'Token inválido o expirado' })
@Controller('users')
export class UsersController {

  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener perfil propio del usuario autenticado' })
  @Get('me')
  public async getMe(@CurrentUser() user: AuthUser) {
    const profile = await this.authService.getProfile(user.sub);
    if (!profile) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return profile;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLES.ADMIN)
  @ApiOperation({ summary: 'Listar usuarios (solo admin)' })
  @ApiForbiddenResponse({ description: 'Requiere rol Administrador' })
  @Get()
  public async getUsers() {
    return await this.usersService.getAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLES.ADMIN)
  @ApiOperation({ summary: 'Obtener usuario por id (solo admin)' })
  @ApiForbiddenResponse({ description: 'Requiere rol Administrador' })
  @Get(':id')
  public async getUser(@Param('id') id: number) {
    return await this.usersService.getOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLES.ADMIN)
  @ApiOperation({ summary: 'Crear usuario (solo admin)' })
  @ApiForbiddenResponse({ description: 'Requiere rol Administrador' })
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
      await this.usersService.create(request);
    }

    return response;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLES.ADMIN)
  @ApiOperation({ summary: 'Actualizar usuario (solo admin)' })
  @ApiForbiddenResponse({ description: 'Requiere rol Administrador' })
  @Put(':id')
  async putUser(
    @Param('id') id: number,
    @Body() request: IPutUserRequest,
    @Res() response: Response,
  ): Promise<Response> {
    if (isNaN(id)) return response.status(400).send();

    const result = await this.usersService.update(id, request);

    if (!result) return response.status(404).send();

    return response.status(202).send();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLES.ADMIN)
  @ApiOperation({ summary: 'Eliminar usuario (solo admin)' })
  @ApiForbiddenResponse({ description: 'Requiere rol Administrador' })
  @Delete(':id')
  async deleteUser(
    @Param('id') id: number,
    @Res() response: Response,
  ): Promise<Response> {
    if (isNaN(id)) return response.status(400).send();

    const result = await this.usersService.delete(id);

    if (!result) return response.status(404).send();

    return response.status(200).send();
  }
}
