import { Controller, Get, Post, Put, Delete, Param, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import type { IPostMealPlanRequest } from './dto/IPostMealPlanRequest';
import type { IPostMealPlanResponse } from './dto/IPostMealPlanResponse';
import type { IPutMealPlanRequest } from './dto/IPutMealPlanRequest';
import { MealPlansService } from 'src/providers/meal-plans/meal-plans.service';

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