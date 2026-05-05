import { Controller, Post, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ILoginRequest } from './dto/ILoginRequest';
import { IRegisterRequest } from './dto/IRegisterRequest';
import { AuthService } from 'src/providers/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() request: ILoginRequest,
    @Res() response: Response,
  ): Promise<Response> {
    const result = await this.authService.login(request.email, request.password);
    if (!result) return response.status(401).json({ message: 'Credenciales inválidas' });
    return response.status(200).json(result);
  }

  @Post('register')
  async register(
    @Body() request: IRegisterRequest,
    @Res() response: Response,
  ): Promise<Response> {
    const result = await this.authService.register(request);
    if (!result) return response.status(409).json({ message: 'El correo ya está registrado' });
    return response.status(201).json({ message: 'Usuario registrado exitosamente' });
  }
}