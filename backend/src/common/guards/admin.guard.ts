import { Injectable, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    if (err || !user) throw err || new ForbiddenException('Token requerido');
    if (user.role !== 'Administrador') throw new ForbiddenException('Acceso restringido a administradores');
    return user;
  }
}
