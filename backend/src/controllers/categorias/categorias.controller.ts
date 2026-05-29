import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

const CATEGORIAS = ['Desayuno', 'Almuerzo', 'Cena', 'Snack'];

@ApiTags('Categorias')
@Controller('categorias')
export class CategoriasController {

  @ApiOperation({ summary: 'Obtener listado de categorías disponibles' })
  @ApiResponse({ status: 200, description: 'Lista de categorías' })
  @Get()
  getCategorias(): string[] {
    return CATEGORIAS;
  }
}
