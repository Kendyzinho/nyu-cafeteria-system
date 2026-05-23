import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return null;

    const payload = { sub: user.id, email: user.email, role: user.tipo };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.nombre,
        lastName: user.apellido,
        role: user.tipo,
        isActive: !!user.activo,
        isResident: !!user.es_residente,
      },
    };
  }

  async register(data: { firstName: string; lastName: string; email: string; password: string }) {
    const existing = await this.usersService.findByEmail(data.email);
    if (existing) return null;

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const isAdmin = data.email.toLowerCase().includes('admin');

    return await this.usersService.create({
      nombre: data.firstName,
      apellido: data.lastName,
      email: data.email,
      password: hashedPassword,
      tipo: isAdmin ? 'Administrador' : 'Cliente',
    });
  }
}
