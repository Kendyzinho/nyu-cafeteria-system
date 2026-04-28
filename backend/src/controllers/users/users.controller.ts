import { Controller, Get, Post, Put, Delete, Param, Body, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { IPostUserRequest } from './dto/IPostUserRequest';
import type { IPostUserResponse } from './dto/IPostUserResponse';
import { IPutUserRequest } from './dto/IPutUserRequest';
import { UsersService } from 'src/providers/users/users.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  @Get()
  public async getUsers() {
    return await this.usersService.getAll();
  }

  @Get(':id')
  public async getUser(@Param('id') id: number) {
    return await this.usersService.getOne(id);
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
      await this.usersService.create(request);
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

    const result = await this.usersService.update(id, request);

    if (!result) return response.status(404).send();

    return response.status(202).send();
  }

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