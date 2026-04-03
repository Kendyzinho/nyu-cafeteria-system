import { Body, Controller, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { StockService } from './stock.service';
import { UpdateStockDto } from './dto/update-stock.dto';

@ApiTags('stocks')
@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('menu-item/:menuItemId')
  @ApiOperation({ summary: 'Ver stock de un ítem' })
  findByMenuItem(@Param('menuItemId', ParseIntPipe) menuItemId: number) {
    return this.stockService.findByMenuItem(menuItemId);
  }

  @Patch('menu-item/:menuItemId')
  @ApiOperation({ summary: 'Actualizar stock (bloquea el ítem si llega a 0)' })
  updateQuantity(@Param('menuItemId', ParseIntPipe) menuItemId: number, @Body() dto: UpdateStockDto) {
    return this.stockService.updateQuantity(menuItemId, dto);
  }
}
