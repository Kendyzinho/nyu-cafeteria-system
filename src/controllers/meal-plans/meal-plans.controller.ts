import { Controller, Get, Post, Put, Delete, Param, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import type { IGetMealPlanResponse } from './dto/IGetMealPlanResponse';
import type { IPostMealPlanRequest } from './dto/IPostMealPlanRequest';
import type { IPostMealPlanResponse } from './dto/IPostMealPlanResponse';
import type { IPutMealPlanRequest } from './dto/IPutMealPlanRequest';

@Controller('meal-plans')
export class MealPlansController {

  private mealPlans: IGetMealPlanResponse[] = [];

  @Get()
  public getMealPlans(): IGetMealPlanResponse[] {
    return this.mealPlans;
  }

  @Get(':id')
  public getMealPlan(@Param('id') id: number): IGetMealPlanResponse | undefined {
    return this.mealPlans.find(e => e.id == id);
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
      const newMealPlan: IGetMealPlanResponse = {
        id: this.mealPlans.length + 1,
        nombre: request.nombre,
        descripcion: request.descripcion,
        precio: request.precio,
        tipo: request.tipo,
        activo: true,
      };
      this.mealPlans.push(newMealPlan);
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

    this.mealPlans.find((plan) => {
      if (plan.id == id) {
        plan.nombre = request?.nombre ?? plan.nombre;
        plan.descripcion = request?.descripcion ?? plan.descripcion;
        plan.precio = request?.precio ?? plan.precio;
        plan.tipo = request?.tipo ?? plan.tipo;
        plan.activo = request?.activo ?? plan.activo;
      }
    });

    return response.status(202).send();
  }

  @Delete(':id')
  async deleteMealPlan(
    @Param('id') id: number,
    @Res() response: Response,
  ): Promise<Response> {
    if (isNaN(id)) return response.status(400).send();

    let found = false;

    this.mealPlans = this.mealPlans.filter((plan) => {
      if (plan.id == id) {
        found = true;
        return false;
      }
      return true;
    });

    if (!found) return response.status(404).send();

    return response.status(200).send();
  }
}