import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PaymentReferenceType } from '../../payment/payment.entity';

@Injectable()
export class PaymentIntegrationService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async processPayment(amount: number, referenceType: PaymentReferenceType, referenceId: number) {
    if (this.configService.get('USE_MOCK') === 'true') {
      return { status: 'approved', external_ref: `MOCK-${Date.now()}` };
    }
    const url = this.configService.get('PAYMENT_API_URL');
    const response = await firstValueFrom(
      this.httpService.post(`${url}/payments`, { amount, referenceType, referenceId }),
    );
    return response.data;
  }
}
