import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
  ) {}

  findAll() {
    return this.studentRepo.find();
  }

  async findOne(id: number) {
    const student = await this.studentRepo.findOne({ where: { id } });
    if (!student) throw new NotFoundException(`Student #${id} not found`);
    return student;
  }

  async findByExternalId(externalId: string) {
    const student = await this.studentRepo.findOne({ where: { external_id: externalId } });
    if (!student) throw new NotFoundException(`Student with external_id ${externalId} not found`);
    return student;
  }

  create(dto: CreateStudentDto) {
    const student = this.studentRepo.create(dto);
    return this.studentRepo.save(student);
  }

  async update(id: number, dto: UpdateStudentDto) {
    const student = await this.findOne(id);
    Object.assign(student, dto);
    return this.studentRepo.save(student);
  }

  async remove(id: number) {
    const student = await this.findOne(id);
    return this.studentRepo.remove(student);
  }
}
