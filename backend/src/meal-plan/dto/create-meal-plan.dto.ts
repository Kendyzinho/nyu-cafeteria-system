import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsPositive, Max, Min } from 'class-validator';
import { PlanType } from '../meal-plan.entity';

export class CreateMealPlanDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  student_id: number;

  @ApiProperty({ enum: PlanType })
  @IsEnum(PlanType)
  plan_type: PlanType;

  @ApiProperty({ example: 4 })
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({ example: 2026 })
  @IsInt()
  @Min(2024)
  year: number;
}
