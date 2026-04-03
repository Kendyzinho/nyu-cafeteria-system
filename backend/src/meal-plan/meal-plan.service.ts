import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MealPlan, MealPlanStatus, PlanType } from './meal-plan.entity';
import { Payment, PaymentReferenceType, PaymentStatus } from '../payment/payment.entity';
import { ConsumptionHistory, ConsumptionType } from '../consumption-history/consumption-history.entity';
import { StudentService } from '../student/student.service';
import { ResidenceStatus } from '../student/student.entity';
import { PaymentIntegrationService } from '../integrations/payment/payment-integration.service';
import { CreateMealPlanDto } from './dto/create-meal-plan.dto';

const PLAN_PRICES: Record<PlanType, number> = {
  [PlanType.BASIC]: 80,
  [PlanType.STANDARD]: 120,
  [PlanType.PREMIUM]: 160,
};

const PLAN_DAILY_CREDITS: Record<PlanType, number> = {
  [PlanType.BASIC]: 1,
  [PlanType.STANDARD]: 2,
  [PlanType.PREMIUM]: 3,
};

@Injectable()
export class MealPlanService {
  constructor(
    @InjectRepository(MealPlan)
    private readonly mealPlanRepo: Repository<MealPlan>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(ConsumptionHistory)
    private readonly consumptionRepo: Repository<ConsumptionHistory>,
    private readonly studentService: StudentService,
    private readonly paymentIntegrationService: PaymentIntegrationService,
  ) {}

  findByStudent(studentId: number) {
    return this.mealPlanRepo.find({
      where: { student: { id: studentId } },
      order: { year: 'DESC', month: 'DESC' },
    });
  }

  findActive(studentId: number) {
    return this.mealPlanRepo.findOne({
      where: { student: { id: studentId }, status: MealPlanStatus.ACTIVE },
    });
  }

  async findOne(id: number) {
    const plan = await this.mealPlanRepo.findOne({ where: { id }, relations: ['student'] });
    if (!plan) throw new NotFoundException(`MealPlan #${id} not found`);
    return plan;
  }

  async create(dto: CreateMealPlanDto) {
    const student = await this.studentService.findOne(dto.student_id);

    // Business rule: solo residentes activos
    if (student.residence_status !== ResidenceStatus.ACTIVE) {
      throw new BadRequestException(
        'Los planes alimentarios son exclusivos para estudiantes con residencia activa',
      );
    }

    // No duplicar plan activo para mismo mes/año
    const existing = await this.mealPlanRepo.findOne({
      where: {
        student: { id: student.id },
        month: dto.month,
        year: dto.year,
        status: MealPlanStatus.ACTIVE,
      },
    });
    if (existing) {
      throw new ConflictException(
        `El estudiante ya tiene un plan activo para ${dto.month}/${dto.year}`,
      );
    }

    const price = PLAN_PRICES[dto.plan_type];
    const dailyCredits = PLAN_DAILY_CREDITS[dto.plan_type];

    // Process payment
    const paymentResult = await this.paymentIntegrationService.processPayment(
      price,
      PaymentReferenceType.MEAL_PLAN,
      0,
    );
    if (paymentResult.status !== 'approved') {
      throw new BadRequestException('El pago del plan fue rechazado');
    }

    const now = new Date();
    const expiresAt = new Date(dto.year, dto.month, 0); // último día del mes

    const plan = this.mealPlanRepo.create({
      student,
      plan_type: dto.plan_type,
      month: dto.month,
      year: dto.year,
      status: MealPlanStatus.ACTIVE,
      price,
      daily_credits: dailyCredits,
      credits_remaining: dailyCredits * 30,
      activated_at: now,
      expires_at: expiresAt,
    });
    const savedPlan = await this.mealPlanRepo.save(plan);

    const payment = this.paymentRepo.create({
      reference_type: PaymentReferenceType.MEAL_PLAN,
      reference_id: savedPlan.id,
      external_ref: paymentResult.external_ref,
      amount: price,
      status: PaymentStatus.APPROVED,
      processed_at: now,
    });
    await this.paymentRepo.save(payment);

    const consumption = this.consumptionRepo.create({
      student,
      mealPlan: savedPlan,
      type: ConsumptionType.MEAL_PLAN,
      total_amount: price,
      discount_amount: undefined,
      final_amount: price,
      consumed_at: now,
    });
    await this.consumptionRepo.save(consumption);

    return savedPlan;
  }
}
