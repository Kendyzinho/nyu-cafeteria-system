import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/user.entity';
import { MenuEntity } from './entities/menu.entity';
import { MealPlanEntity } from './entities/meal-plan.entity';
import { PromotionEntity } from './entities/promotion.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(private readonly dataSource: DataSource) {}

  async onApplicationBootstrap() {
    await this.seedUsers();
    await this.seedMenu();
    await this.seedPlans();
    await this.seedPromotions();
  }

  private async seedUsers() {
    const repo = this.dataSource.getRepository(UserEntity);
    if ((await repo.count()) > 0) return;

    const hash = await bcrypt.hash('123456', 10);
    await repo.save([
      { nombre: 'Cristian', apellido: 'Admin', email: 'admin@nyu.edu', password: hash, tipo: 'admin', matriculaActiva: true, residenciaActiva: false },
      { nombre: 'Juan', apellido: 'Pérez', email: 'juan@nyu.edu', password: hash, tipo: 'student', matriculaActiva: false, residenciaActiva: true },
      { nombre: 'María', apellido: 'García', email: 'maria@nyu.edu', password: hash, tipo: 'student', matriculaActiva: true, residenciaActiva: false },
      { nombre: 'Carlos', apellido: 'López', email: 'carlos@nyu.edu', password: hash, tipo: 'student', matriculaActiva: false, residenciaActiva: false },
    ]);
  }

  private async seedMenu() {
    const repo = this.dataSource.getRepository(MenuEntity);
    if ((await repo.count()) > 0) return;

    const fecha = new Date('2026-01-01');
    await repo.save([
      { nombre: 'Hamburguesa Clásica', descripcion: 'Con queso, lechuga y tomate', precio: 8500, categoria: 'Almuerzo', disponible: true, stockActual: 50, fechaDisponible: fecha },
      { nombre: 'Ensalada César', descripcion: 'Pechuga de pollo, crutones y aderezo', precio: 6000, categoria: 'Saludable', disponible: true, stockActual: 30, fechaDisponible: fecha },
      { nombre: 'Café Americano', descripcion: 'Café recién preparado', precio: 2500, categoria: 'Bebidas', disponible: true, stockActual: 100, fechaDisponible: fecha },
      { nombre: 'Pizza Margarita', descripcion: 'Salsa de tomate, mozzarella y albahaca', precio: 9000, categoria: 'Cena', disponible: true, stockActual: 20, fechaDisponible: fecha },
      { nombre: 'Jugo Natural', descripcion: 'Jugo de fruta fresca del día', precio: 3500, categoria: 'Bebidas', disponible: true, stockActual: 40, fechaDisponible: fecha },
      { nombre: 'Bowl de Quinoa', descripcion: 'Quinoa con vegetales y proteína', precio: 7500, categoria: 'Saludable', disponible: true, stockActual: 25, fechaDisponible: fecha },
      { nombre: 'Wrap Vegetariano', descripcion: 'Tortilla con vegetales frescos', precio: 5500, categoria: 'Almuerzo', disponible: true, stockActual: 1, fechaDisponible: fecha },
      { nombre: 'Sándwich de Pollo', descripcion: 'Pollo a la plancha con vegetales', precio: 6500, categoria: 'Almuerzo', disponible: true, stockActual: 15, fechaDisponible: fecha },
    ]);
  }

  private async seedPlans() {
    const repo = this.dataSource.getRepository(MealPlanEntity);
    if ((await repo.count()) > 0) return;

    await repo.save([
      { nombre: 'Plan Residente Mensual', descripcion: '30 comidas al mes para residentes del campus', precio: 150000, tipo: 'residente', activo: true },
      { nombre: 'Plan Residente Semanal', descripcion: '7 comidas por semana para residentes', precio: 45000, tipo: 'residente', activo: true },
      { nombre: 'Plan Básico Almuerzo', descripcion: '20 almuerzos al mes para cualquier estudiante', precio: 80000, tipo: 'regular', activo: true },
      { nombre: 'Plan Snacks', descripcion: '15 snacks o bebidas al mes', precio: 35000, tipo: 'regular', activo: true },
    ]);
  }

  private async seedPromotions() {
    const repo = this.dataSource.getRepository(PromotionEntity);
    if ((await repo.count()) > 0) return;

    await repo.save([
      {
        nombre: 'Descuento Universitario',
        descripcion: 'Descuento para estudiantes con matrícula activa',
        descuento: 15,
        fechaInicio: new Date('2026-04-01'),
        fechaFin: new Date('2026-06-30'),
        activa: true,
        reqMatricula: true,
        reqResidencia: false,
        tipoAplicacion: 'todo',
        categoria: null,
        productosIds: null,
      },
      {
        nombre: 'Beneficio Residente',
        descripcion: 'Descuento exclusivo para residentes en bebidas',
        descuento: 25,
        fechaInicio: new Date('2026-04-01'),
        fechaFin: new Date('2026-12-31'),
        activa: true,
        reqMatricula: true,
        reqResidencia: true,
        tipoAplicacion: 'categoria',
        categoria: 'Bebidas',
        productosIds: null,
      },
      {
        nombre: 'Promo Combo',
        descripcion: 'Descuento en hamburguesa y pizza',
        descuento: 20,
        fechaInicio: new Date('2026-04-20'),
        fechaFin: new Date('2026-05-20'),
        activa: true,
        reqMatricula: true,
        reqResidencia: false,
        tipoAplicacion: 'producto',
        categoria: null,
        productosIds: [1, 4],
      },
      {
        nombre: 'Semana Saludable',
        descripcion: 'Descuento en toda la línea saludable',
        descuento: 10,
        fechaInicio: new Date('2026-04-25'),
        fechaFin: new Date('2026-05-02'),
        activa: false,
        reqMatricula: false,
        reqResidencia: false,
        tipoAplicacion: 'categoria',
        categoria: 'Saludable',
        productosIds: null,
      },
    ]);
  }
}
