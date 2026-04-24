import { Controller, Post, Body } from '@nestjs/common';
import type { ILoginRequest } from './dto/ILoginRequest';
import type { ILoginResponse } from './dto/ILoginResponse';
import type { IRegisterRequest } from './dto/IRegisterRequest';
import type { IRegisterResponse } from './dto/IRegisterResponse';

@Controller('auth')
export class AuthController {

  @Post('login')
  async login(
    @Body() request: ILoginRequest
  ): Promise<ILoginResponse> {
    return {
      accessToken: 'token_placeholder',
      statusCode: 200,
      statusDescription: 'Login exitoso',
    };
  }

  @Post('register')
  async register(
    @Body() request: IRegisterRequest
  ): Promise<IRegisterResponse> {
    return {
      data: null,
      statusCode: 200,
      statusDescription: 'Usuario registrado',
      errors: null,
    };
  }
}