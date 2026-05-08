import { Controller, Get, Post, Put, Delete, Param, Body, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import type { IPostMealPlanRequest } from './dto/IPostMealPlanRequest';
import type { IPostMealPlanResponse } from './dto/IPostMealPlanResponse';
import type { IPutMealPlanRequest } from './dto/IPutMealPlanRequest';
import { MealPlansService } from 'src/providers/meal-plans/meal-plans.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { USER_ROLES } from 'src/auth/constants/roles.constant';

@ApiTags('Meal Plans')
@ApiBearerAuth('jwt-auth')
@Controller('meal-plans')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MealPlansController {

  constructor(private readonly mealPlansService: MealPlansService) {}

  @ApiOperation({ summary: 'Obtener todos los planes' })
  @Get()
  public async getMealPlans() {
    return await this.mealPlansService.getAll();
  }

  @ApiOperation({ summary: 'Obtener un plan por id' })
  @Get(':id')
  public async getMealPlan(@Param('id') id: number) {
    return await this.mealPlansService.getOne(id);
  }

  @ApiOperation({ summary: 'Crear un nuevo plan' })
  @Roles(USER_ROLES.ADMIN)
  @Post()
  async postMealPlan(
    @Body() request: IPostMealPlanRequest
  ): Promise<IPostMealPlanResponse> {
    const response: IPostMealPlanResponse = {
      data: null,
      statusCode: 200,
      statusDescription: 'Plan de alimentación creado',
      errors: null,
    };

    if (request) {
      await this.mealPlansService.create(request);
    }

    return response;
  }

  @ApiOperation({ summary: 'Actualizar un plan' })
  @Roles(USER_ROLES.ADMIN)
  @Put(':id')
  async putMealPlan(
    @Param('id') id: number,
    @Body() request: IPutMealPlanRequest,
    @Res() response: Response,
  ): Promise<Response> {
    if (isNaN(id)) return response.status(400).send();

    const result = await this.mealPlansService.update(id, request);

    if (!result) return response.status(404).send();

    return response.status(202).send();
  }

  @ApiOperation({ summary: 'Eliminar un plan' })
  @Roles(USER_ROLES.ADMIN)
  @Delete(':id')
  async deleteMealPlan(
    @Param('id') id: number,
    @Res() response: Response,
  ): Promise<Response> {
    if (isNaN(id)) return response.status(400).send();

    const result = await this.mealPlansService.delete(id);

    if (!result) return response.status(404).send();

    return response.status(200).send();
  }
}
