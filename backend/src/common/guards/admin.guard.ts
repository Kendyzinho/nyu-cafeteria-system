import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from 'src/providers/users/users.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const header = request.headers['authorization'];

    if (!header || typeof header !== 'string') {
      throw new UnauthorizedException('Token requerido');
    }

    const match = header.match(/^Bearer\s+token-(\d+)$/);
    if (!match) {
      throw new UnauthorizedException('Token inválido');
    }

    const userId = Number(match[1]);
    const user = await this.usersService.getOne(userId);

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (user.tipo !== 'Administrador') {
      throw new ForbiddenException('Acceso restringido a administradores');
    }

    (request as Request & { user?: unknown }).user = user;
    return true;
  }
}
