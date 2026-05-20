import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MockUsuarioEntity } from './entities/mock-usuario.entity';
import { ComidaEntity } from './entities/comida.entity';
import { PedidoEntity } from './entities/pedido.entity';
import { PlanesCatalogoEntity } from './entities/planes-catalogo.entity';
import { PromocionEntity } from './entities/promocion.entity';
import { SuscripcionAlumnoEntity } from './entities/suscripcion-alumno.entity';
import { DetallePedidoEntity } from './entities/detalle-pedido.entity';
import { MockPagoEntity } from './entities/mock-pago.entity';
import { InsumoEntity } from './entities/insumo.entity';
import { RecetaComidaEntity } from './entities/receta-comida.entity';
import { MockReservaBibliotecaEntity } from './entities/mock-reserva-biblioteca.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [
          MockUsuarioEntity,
          ComidaEntity,
          PedidoEntity,
          PlanesCatalogoEntity,
          PromocionEntity,
          SuscripcionAlumnoEntity,
          DetallePedidoEntity,
          MockPagoEntity,
          InsumoEntity,
          RecetaComidaEntity,
          MockReservaBibliotecaEntity,
        ],
        synchronize: false,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
  providers: [],
})
export class DatabaseModule {}