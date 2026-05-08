import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { USER_ROLES } from 'src/auth/constants/roles.constant';
import type { AuthUser } from 'src/auth/interfaces/auth-user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.usersService.findByEmail(normalizedEmail);
    if (!user) return null;

    const isBcryptPassword = user.password.startsWith('$2a$') || user.password.startsWith('$2b$');
    const isPasswordValid = isBcryptPassword
      ? await bcrypt.compare(password, user.password)
      : user.password === password;
    if (!isPasswordValid || !user.isActive) return null;

    const payload: AuthUser = {
      sub: user.id,
      email: user.email,
      role: user.tipo,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: this.mapUser(user),
    };
  }

  async getProfile(userId: number) {
    const user = await this.usersService.getOne(userId);
    if (!user) return null;
    return this.mapUser(user);
  }

  private mapUser(user: {
    id: number;
    email: string;
    nombre: string;
    apellido: string;
    tipo: string;
    isActive: boolean;
  }) {
    const userRole = user.tipo.toLowerCase();
    return {
      id: user.id,
      email: user.email,
      firstName: user.nombre,
      lastName: user.apellido,
      role: user.tipo,
      isActive: user.isActive,
      isResident: userRole === USER_ROLES.RESIDENT.toLowerCase(),
    };
  }
}
