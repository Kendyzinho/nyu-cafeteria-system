import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class ILoginRequest {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}