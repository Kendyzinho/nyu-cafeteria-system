import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'mock_pago' })
export class MockPagoEntity {
  constructor(data?: Partial<MockPagoEntity>) {
    if (data) Object.assign(this, data);
  }

  @PrimaryGeneratedColumn()
  id!: number;

  @Column('decimal', { name: 'monto_total', precision: 10, scale: 2 })
  montoTotal!: number;

  @Column({ name: 'metodo_pago' })
  metodoPago!: string;

  @Column()
  estado!: string;

  @Column({ name: 'fecha_transaccion' })
  fechaTransaccion!: Date;

  @Column({ name: 'referencia_origen' })
  referenciaOrigen!: string;
}
