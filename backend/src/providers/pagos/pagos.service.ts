import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MockPagoEntity } from '../../database/entities/mock-pago.entity';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(MockPagoEntity)
    private readonly pagoRepository: Repository<MockPagoEntity>,
  ) {}

  async procesarPago(data: {
    email: string;
    monto: number;
    datosTarjeta?: { titular?: string; numeroTarjeta?: string; fechaVencimiento?: string; cvv?: string };
  }): Promise<{ status: 'APPROVED' | 'REJECTED'; transactionId?: number; mensaje?: string }> {

    // Validaciones básicas de simulación
    if (!data.monto || data.monto <= 0) {
      return { status: 'REJECTED', mensaje: 'Monto inválido' };
    }

    const tarjeta = data.datosTarjeta;
    if (tarjeta) {
      const numero = (tarjeta.numeroTarjeta ?? '').replace(/\s/g, '');
      if (numero.length !== 16 || !/^\d+$/.test(numero)) {
        return { status: 'REJECTED', mensaje: 'Número de tarjeta inválido' };
      }
      if (!tarjeta.cvv || !/^\d{3,4}$/.test(tarjeta.cvv)) {
        return { status: 'REJECTED', mensaje: 'CVV inválido' };
      }
    }

    // Registrar pago aprobado en mock_pago
    const pago = this.pagoRepository.create({
      montoTotal: data.monto,
      metodoPago: 'Tarjeta',
      estado: 'APPROVED',
      fechaTransaccion: new Date(),
      referenciaOrigen: data.email ?? 'desconocido',
    });
    const saved = await this.pagoRepository.save(pago);

    return { status: 'APPROVED', transactionId: saved.id };
  }
}