import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConsumptionHistoryService } from './consumption-history.service';

@ApiTags('consumption-history')
@Controller('consumption-history')
export class ConsumptionHistoryController {
  constructor(private readonly consumptionHistoryService: ConsumptionHistoryService) {}

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Historial de consumo de un estudiante' })
  findByStudent(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.consumptionHistoryService.findByStudent(studentId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.consumptionHistoryService.findOne(id);
  }
}
