import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { ILoginRequest } from './dto/ILoginRequest';
import { AuthService } from 'src/providers/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { AuthUser } from 'src/auth/interfaces/auth-user.interface';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Iniciar sesión y obtener JWT' })
  @Post('login')
  async login(
    @Body() request: ILoginRequest,
    @Res() response: Response,
  ): Promise<Response> {
    const result = await this.authService.login(request.email, request.password);
    if (!result) return response.status(401).json({ message: 'Credenciales inválidas' });
    return response.status(200).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o expirado' })
  @Get('profile')
  async profile(@CurrentUser() user: AuthUser) {
    const profile = await this.authService.getProfile(user.sub);
    if (!profile) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return profile;
  }
}
