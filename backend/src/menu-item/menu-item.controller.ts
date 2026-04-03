import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MenuItemService } from './menu-item.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@ApiTags('menu-items')
@Controller('menu-items')
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @Get()
  @ApiOperation({ summary: 'Listar ítems del menú (filtrar por fecha y/o categoría)' })
  @ApiQuery({ name: 'date', required: false, example: '2026-04-02' })
  @ApiQuery({ name: 'category_id', required: false })
  findAll(@Query('date') date?: string, @Query('category_id') categoryId?: string) {
    return this.menuItemService.findAll(date, categoryId ? +categoryId : undefined);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.menuItemService.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Crear ítem de menú (crea stock automáticamente)' })
  create(@Body() dto: CreateMenuItemDto) { return this.menuItemService.create(dto); }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMenuItemDto) {
    return this.menuItemService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.menuItemService.remove(id); }
}
