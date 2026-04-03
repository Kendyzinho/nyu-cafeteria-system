import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { AcademicStatus, ResidenceStatus, StudentType } from '../student.entity';

export class CreateStudentDto {
  @ApiProperty({ example: 'NYU-001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  external_id: string;

  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiProperty({ example: 'juan@nyu.edu' })
  @IsEmail()
  email: string;

  @ApiProperty({ enum: StudentType })
  @IsEnum(StudentType)
  student_type: StudentType;

  @ApiProperty({ enum: AcademicStatus, required: false })
  @IsEnum(AcademicStatus)
  @IsOptional()
  academic_status?: AcademicStatus;

  @ApiProperty({ enum: ResidenceStatus, required: false })
  @IsEnum(ResidenceStatus)
  @IsOptional()
  residence_status?: ResidenceStatus;
}
