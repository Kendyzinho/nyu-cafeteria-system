import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion, ProfileType } from './promotion.entity';
import { Student, AcademicStatus, ResidenceStatus } from '../student/student.entity';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(Promotion)
    private readonly promotionRepo: Repository<Promotion>,
  ) {}

  findAll() {
    return this.promotionRepo.find();
  }

  async findOne(id: number) {
    const promo = await this.promotionRepo.findOne({ where: { id } });
    if (!promo) throw new NotFoundException(`Promotion #${id} not found`);
    return promo;
  }

  async findApplicableForStudent(student: Student): Promise<Promotion | null> {
    const today = new Date().toISOString().split('T')[0];
    const promos = await this.promotionRepo.find({ where: { is_active: true } });

    const applicable = promos.filter((p) => {
      const inDate = p.valid_from <= today && p.valid_to >= today;
      if (!inDate) return false;
      if (p.profile_type === ProfileType.ALL) return true;
      if (p.profile_type === ProfileType.ACTIVE && student.academic_status === AcademicStatus.ACTIVE) return true;
      if (p.profile_type === ProfileType.RESIDENT && student.residence_status === ResidenceStatus.ACTIVE) return true;
      return false;
    });

    if (applicable.length === 0) return null;
    return applicable.reduce((best, curr) =>
      Number(curr.discount_pct) > Number(best.discount_pct) ? curr : best,
    );
  }

  create(dto: CreatePromotionDto) {
    const promo = this.promotionRepo.create(dto);
    return this.promotionRepo.save(promo);
  }

  async update(id: number, dto: UpdatePromotionDto) {
    const promo = await this.findOne(id);
    Object.assign(promo, dto);
    return this.promotionRepo.save(promo);
  }

  async remove(id: number) {
    const promo = await this.findOne(id);
    return this.promotionRepo.remove(promo);
  }
}
