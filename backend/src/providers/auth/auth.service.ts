import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || user.password !== password) return null;
    return {
      access_token: `token-${user.id}`,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.nombre,
        lastName: user.apellido,
        role: user.tipo,
        isActive: true,
        isResident: user.tipo === 'residente'
      }
    };
  }

  async register(data: { firstName: string; lastName: string; email: string; password: string }) {
    const existing = await this.usersService.findByEmail(data.email);
    if (existing) return null;
    const isAdmin = data.email.toLowerCase().includes('admin');
    return await this.usersService.create({
      nombre: data.firstName,
      apellido: data.lastName,
      email: data.email,
      password: data.password,
      tipo: isAdmin ? 'Administrador' : 'Cliente'
    });
  }
}