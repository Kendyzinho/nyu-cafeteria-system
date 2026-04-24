import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentReferenceType, PaymentStatus } from './payment.entity';
import { Order, OrderStatus, PaymentStatus as OrderPayStatus } from '../order/order.entity';
import { WebhookPaymentDto } from './dto/webhook-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  findAll() {
    return this.paymentRepo.find({ order: { id: 'DESC' } });
  }

  findByReference(type: PaymentReferenceType, referenceId: number) {
    return this.paymentRepo.findOne({ where: { reference_type: type, reference_id: referenceId } });
  }

  async handleWebhook(dto: WebhookPaymentDto) {
    const payment = await this.paymentRepo.findOne({ where: { reference_id: dto.reference_id } });
    if (payment) {
      payment.status = dto.status;
      if (dto.external_ref) payment.external_ref = dto.external_ref;
      payment.processed_at = new Date();
      await this.paymentRepo.save(payment);

      if (payment.reference_type === PaymentReferenceType.ORDER) {
        const order = await this.orderRepo.findOne({ where: { id: dto.reference_id } });
        if (order) {
          order.payment_status =
            dto.status === PaymentStatus.APPROVED ? OrderPayStatus.APPROVED : OrderPayStatus.REJECTED;
          order.status =
            dto.status === PaymentStatus.APPROVED ? OrderStatus.CONFIRMED : OrderStatus.PENDING;
          await this.orderRepo.save(order);
        }
      }
    }
    return { received: true };
  }
}
