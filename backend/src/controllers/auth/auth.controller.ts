import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from 'src/providers/auth/auth.service';
import type { ILoginRequest } from './dto/ILoginRequest';
import type { IRegisterRequest } from './dto/IRegisterRequest';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() request: ILoginRequest) {
    return await this.authService.login(request.email, request.password);
  }

  @Post('register')
  async register(@Body() request: IRegisterRequest) {
    return await this.authService.register(
      request.nombre,
      request.apellido,
      request.email,
      request.password,
      request.tipo,
    );
  }
}