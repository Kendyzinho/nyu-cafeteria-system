import { Test, TestingModule } from '@nestjs/testing';
import { MealPlansController } from './meal-plans.controller';

describe('MealPlansController', () => {
  let controller: MealPlansController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MealPlansController],
    }).compile();

    controller = module.get<MealPlansController>(MealPlansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
