import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/database/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      tipo: user.tipo,
      nombre: user.nombre,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      statusCode: 200,
      statusDescription: 'Login exitoso',
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        tipo: user.tipo,
        matriculaActiva: user.matriculaActiva,
        residenciaActiva: user.residenciaActiva,
      },
    };
  }

  async register(
    nombre: string,
    apellido: string,
    email: string,
    password: string,
    tipo: string,
  ) {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      nombre,
      apellido,
      email,
      password: hashedPassword,
      tipo: tipo || 'student',
    });

    await this.userRepository.save(user);

    return {
      data: { id: user.id, nombre: user.nombre, email: user.email },
      statusCode: 201,
      statusDescription: 'Usuario registrado exitosamente',
      errors: null,
    };
  }
}
