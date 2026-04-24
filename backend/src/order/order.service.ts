import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus, PaymentStatus } from './order.entity';
import { OrderItem } from '../order-item/order-item.entity';
import { ConsumptionHistory, ConsumptionType } from '../consumption-history/consumption-history.entity';
import { Payment, PaymentReferenceType, PaymentStatus as PayStatus } from '../payment/payment.entity';
import { StudentService } from '../student/student.service';
import { MenuItemService } from '../menu-item/menu-item.service';
import { StockService } from '../stock/stock.service';
import { PromotionService } from '../promotion/promotion.service';
import { PaymentIntegrationService } from '../integrations/payment/payment-integration.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(ConsumptionHistory)
    private readonly consumptionRepo: Repository<ConsumptionHistory>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    private readonly studentService: StudentService,
    private readonly menuItemService: MenuItemService,
    private readonly stockService: StockService,
    private readonly promotionService: PromotionService,
    private readonly paymentIntegrationService: PaymentIntegrationService,
  ) {}

  findAll() {
    return this.orderRepo.find({
      relations: ['student', 'items', 'items.menuItem', 'promotion'],
      order: { id: 'DESC' },
    });
  }

  findByStudent(studentId: number) {
    return this.orderRepo.find({
      where: { student: { id: studentId } },
      relations: ['items', 'items.menuItem', 'promotion'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['student', 'items', 'items.menuItem', 'promotion'],
    });
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    return order;
  }

  async create(dto: CreateOrderDto) {
    const student = await this.studentService.findOne(dto.student_id);

    // 1. Validate stock for all items
    const itemsData: { menuItem: any; quantity: number; unit_price: number }[] = [];
    for (const item of dto.items) {
      const menuItem = await this.menuItemService.findOne(item.menu_item_id);
      if (menuItem.is_blocked) {
        throw new BadRequestException(`"${menuItem.name}" está agotado y no puede pedirse`);
      }
      const stock = await this.stockService.findByMenuItem(menuItem.id);
      if (stock.quantity < item.quantity) {
        throw new BadRequestException(
          `Stock insuficiente para "${menuItem.name}". Disponible: ${stock.quantity}`,
        );
      }
      itemsData.push({ menuItem, quantity: item.quantity, unit_price: menuItem.base_price });
    }

    // 2. Calculate base total
    const baseTotal = itemsData.reduce((sum, i) => sum + Number(i.unit_price) * i.quantity, 0);

    // 3. Apply promotion if applicable
    const promotion = await this.promotionService.findApplicableForStudent(student);
    let discountAmount = 0;
    let finalTotal = baseTotal;
    if (promotion) {
      discountAmount = (baseTotal * Number(promotion.discount_pct)) / 100;
      finalTotal = baseTotal - discountAmount;
    }

    // 4. Create order in payment_pending state
    const order = this.orderRepo.create({
      student,
      pickup_time: new Date(dto.pickup_time),
      status: OrderStatus.PAYMENT_PENDING,
      total_price: finalTotal,
      discount_applied: discountAmount > 0 ? discountAmount : undefined,
      promotion: promotion ?? undefined,
      payment_status: PaymentStatus.PENDING,
    });
    const savedOrder = await this.orderRepo.save(order) as unknown as Order;

    // 5. Save order items
    for (const item of itemsData) {
      const orderItem = this.orderItemRepo.create({
        order: savedOrder,
        menuItem: item.menuItem,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: Number(item.unit_price) * item.quantity,
      });
      await this.orderItemRepo.save(orderItem);
    }

    // 6. Process payment
    const paymentResult = await this.paymentIntegrationService.processPayment(
      finalTotal,
      PaymentReferenceType.ORDER,
      savedOrder.id,
    );

    // 7. Register payment record
    const payment = this.paymentRepo.create({
      reference_type: PaymentReferenceType.ORDER,
      reference_id: savedOrder.id,
      external_ref: paymentResult.external_ref,
      amount: finalTotal,
      status: paymentResult.status === 'approved' ? PayStatus.APPROVED : PayStatus.REJECTED,
      processed_at: new Date(),
    });
    await this.paymentRepo.save(payment);

    if (paymentResult.status !== 'approved') {
      savedOrder.status = OrderStatus.PENDING;
      savedOrder.payment_status = PaymentStatus.REJECTED;
      await this.orderRepo.save(savedOrder);
      throw new BadRequestException('El pago fue rechazado por el sistema de pagos');
    }

    // 8. Confirm order and decrement stock
    savedOrder.status = OrderStatus.CONFIRMED;
    savedOrder.payment_status = PaymentStatus.APPROVED;
    await this.orderRepo.save(savedOrder);

    for (const item of itemsData) {
      await this.stockService.decrementStock(item.menuItem.id, item.quantity);
    }

    // 9. Register consumption history
    const consumption = this.consumptionRepo.create({
      student,
      order: savedOrder,
      type: ConsumptionType.ORDER,
      total_amount: baseTotal,
      discount_amount: discountAmount > 0 ? discountAmount : null,
      final_amount: finalTotal,
      consumed_at: new Date(),
    });
    await this.consumptionRepo.save(consumption);

    return this.findOne(savedOrder.id);
  }

  async updateStatus(id: number, dto: UpdateOrderStatusDto) {
    const order = await this.findOne(id);
    order.status = dto.status;
    return this.orderRepo.save(order);
  }
}
