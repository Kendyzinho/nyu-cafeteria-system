import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const usersServiceMock = {
      findByEmail: jest.fn(),
      getOne: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    const jwtServiceMock = {
      signAsync: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns null when user does not exist', async () => {
    usersService.findByEmail.mockResolvedValue(null);

    await expect(service.login('test@nyu.edu', '123456')).resolves.toBeNull();
  });

  it('returns token and mapped user when credentials are valid', async () => {
    const hashedPassword = await bcrypt.hash('123456', 10);
    usersService.findByEmail.mockResolvedValue({
      id: 10,
      email: 'student@nyu.edu',
      nombre: 'Ana',
      apellido: 'Perez',
      tipo: 'Cliente',
      password: hashedPassword,
      isActive: true,
    } as any);
    jwtService.signAsync.mockResolvedValue('mock-jwt-token');

    const result = await service.login('student@nyu.edu', '123456');

    expect(result).toEqual({
      access_token: 'mock-jwt-token',
      user: {
        id: 10,
        email: 'student@nyu.edu',
        firstName: 'Ana',
        lastName: 'Perez',
        role: 'Cliente',
        isActive: true,
        isResident: false,
      },
    });
  });

  it('returns null when user is inactive', async () => {
    const hashedPassword = await bcrypt.hash('123456', 10);
    usersService.findByEmail.mockResolvedValue({
      id: 20,
      email: 'inactive@nyu.edu',
      nombre: 'Ina',
      apellido: 'Ctive',
      tipo: 'Cliente',
      password: hashedPassword,
      isActive: false,
    } as any);

    await expect(service.login('inactive@nyu.edu', '123456')).resolves.toBeNull();
  });
});
