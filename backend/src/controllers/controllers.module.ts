import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MenuController } from './menu/menu.controller';
import { PedidosController } from './pedidos/pedidos.controller';
import { PlanesComidaController } from './planes-comida/planes-comida.controller';
import { StockController } from './stock/stock.controller';
import { PromocionesController } from './promociones/promociones.controller';
import { UsuariosController } from './usuarios/usuarios.controller';
import { AuthController } from './auth/auth.controller';
import { CategoriasController } from './categorias/categorias.controller';
import { ComidaEntity } from 'src/database/entities/comida.entity';
import { PedidoEntity } from 'src/database/entities/pedido.entity';
import { PlanesCatalogoEntity } from 'src/database/entities/planes-catalogo.entity';
import { PromocionEntity } from 'src/database/entities/promocion.entity';
import { MockUsuarioEntity } from 'src/database/entities/mock-usuario.entity';
import { DetallePedidoEntity } from 'src/database/entities/detalle-pedido.entity';
import { MenuService } from 'src/providers/menu/menu.service';
import { PedidosService } from 'src/providers/pedidos/pedidos.service';
import { PlanesComidaService } from 'src/providers/planes-comida/planes-comida.service';
import { StockService } from 'src/providers/stock/stock.service';
import { PromocionesService } from 'src/providers/promociones/promociones.service';
import { UsuariosService } from 'src/providers/usuarios/usuarios.service';
import { AuthService } from 'src/providers/auth/auth.service';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { AdminGuard } from 'src/common/guards/admin.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      ComidaEntity,
      PedidoEntity,
      DetallePedidoEntity,
      PlanesCatalogoEntity,
      PromocionEntity,
      MockUsuarioEntity,
      SuscripcionAlumnoEntity,

    ]),
  ],
  controllers: [
    MenuController,
    PedidosController,
    PlanesComidaController,
    StockController,
    PromocionesController,
    UsuariosController,
    AuthController,
    CategoriasController,
  ],
  providers: [
    MenuService,
    PedidosService,
    PlanesComidaService,
    StockService,
    PromocionesService,
    UsuariosService,
    AuthService,
    JwtStrategy,
    AdminGuard,
  ],
})
export class ControllersModule {}
