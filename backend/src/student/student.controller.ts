import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@ApiTags('students')
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  findAll() { return this.studentService.findAll(); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.studentService.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Registrar/sincronizar estudiante desde sistema externo' })
  create(@Body() dto: CreateStudentDto) { return this.studentService.create(dto); }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar estado académico o de residencia del estudiante' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStudentDto) {
    return this.studentService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.studentService.remove(id); }
}
