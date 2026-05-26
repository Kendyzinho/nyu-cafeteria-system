import { Controller, Post, Get, Body, Res, UseGuards, Request } from '@nestjs/common';
import type { Response } from 'express';
import { ILoginRequest } from './dto/ILoginRequest';
import { IRegisterRequest } from './dto/IRegisterRequest';
import { AuthService } from 'src/providers/auth/auth.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Auth')
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

  @ApiOperation({ summary: 'Obtener datos del usuario autenticado' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req: any) {
    return await this.authService.getMe(req.user.id);
  }
}