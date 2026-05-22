import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'mock_reserva_biblioteca' })
export class MockReservaBibliotecaEntity {
  constructor(data?: Partial<MockReservaBibliotecaEntity>) {
    if (data) Object.assign(this, data);
  }

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'date' })
  fecha!: Date;

  @Column({ name: 'hora_inicio', type: 'time' })
  horaInicio!: string;

  @Column({ name: 'hora_fin', type: 'time' })
  horaFin!: string;

  @Column({ name: 'cantidad_estudiantes', default: 0 })
  cantidadEstudiantes!: number;
}
