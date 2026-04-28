import { Controller, Get, Post, Put, Delete, Param, Body, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { IPostMealPlanRequest } from './dto/IPostMealPlanRequest';
import type { IPostMealPlanResponse } from './dto/IPostMealPlanResponse';
import { IPutMealPlanRequest } from './dto/IPutMealPlanRequest';
import { MealPlansService } from 'src/providers/meal-plans/meal-plans.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@ApiTags('Meal Plans')
@Controller('meal-plans')
export class MealPlansController {
  constructor(private readonly mealPlansService: MealPlansService) {}

  @Get()
  public async getMealPlans() {
    return await this.mealPlansService.getAll();
  }

  @Get(':id')
  public async getMealPlan(@Param('id') id: number) {
    return await this.mealPlansService.getOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
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