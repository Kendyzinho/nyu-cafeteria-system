import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  findAll() { return this.orderService.findAll(); }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Ver pedidos de un estudiante' })
  findByStudent(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.orderService.findByStudent(studentId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.orderService.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Crear pedido: valida stock → aplica descuento → procesa pago → confirma' })
  create(@Body() dto: CreateOrderDto) { return this.orderService.create(dto); }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Actualizar estado del pedido (ej: ready, delivered)' })
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOrderStatusDto) {
    return this.orderService.updateStatus(id, dto);
  }
}
