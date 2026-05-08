import { Test, TestingModule } from '@nestjs/testing';
import { MealPlansController } from './meal-plans.controller';
import { MealPlansService } from 'src/providers/meal-plans/meal-plans.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

describe('MealPlansController', () => {
  let controller: MealPlansController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MealPlansController],
      providers: [
        {
          provide: MealPlansService,
          useValue: { getAll: jest.fn(), getOne: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
        },
        { provide: JwtAuthGuard, useValue: { canActivate: jest.fn(() => true) } },
        { provide: RolesGuard, useValue: { canActivate: jest.fn(() => true) } },
        { provide: JwtService, useValue: { verify: jest.fn() } },
        { provide: ConfigService, useValue: { get: jest.fn() } },
        { provide: Reflector, useValue: { getAllAndOverride: jest.fn() } },
      ],
    }).compile();

    controller = module.get<MealPlansController>(MealPlansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
