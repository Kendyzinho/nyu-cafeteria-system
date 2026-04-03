import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MealPlanService } from './meal-plan.service';
import { CreateMealPlanDto } from './dto/create-meal-plan.dto';

@ApiTags('meal-plans')
@Controller('meal-plans')
export class MealPlanController {
  constructor(private readonly mealPlanService: MealPlanService) {}

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Ver todos los planes de un estudiante' })
  findByStudent(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.mealPlanService.findByStudent(studentId);
  }

  @Get('student/:studentId/active')
  @ApiOperation({ summary: 'Ver plan activo del estudiante' })
  findActive(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.mealPlanService.findActive(studentId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.mealPlanService.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Contratar plan mensual (requiere residencia activa)' })
  create(@Body() dto: CreateMealPlanDto) { return this.mealPlanService.create(dto); }
}
