import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { WebhookPaymentDto } from './dto/webhook-payment.dto';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  findAll() { return this.paymentService.findAll(); }

  @Post('webhook')
  @ApiOperation({ summary: 'Recibir confirmación de pago desde Sistema de Pagos externo' })
  handleWebhook(@Body() dto: WebhookPaymentDto) {
    return this.paymentService.handleWebhook(dto);
  }
}
