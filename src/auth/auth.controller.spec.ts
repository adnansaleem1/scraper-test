import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { BadRequestException, ExecutionContext } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    validateUser: jest.fn((username, password) => {
      if (username === 'username' && password === 'password') {
        return { userId: 1, username: 'username' };
      }
      return null;
    }),
    login: jest.fn(user => {
      return { access_token: 'fake-jwt-token' };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        PassportModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET || 'test-secret',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        LocalAuthGuard,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an access token on successful login', async () => {
    const req = { user: { username: 'testuser', userId: 1 } };
    const loginDto = { username: 'testuser', password: 'testpass' };

    const result = await controller.login(req, loginDto);

    expect(result).toEqual({ access_token: 'fake-jwt-token' });
    expect(authService.login).toHaveBeenCalledWith(req.user);
  });

  it('should throw BadRequestException if username is missing', async () => {
    const req = { user: { username: 'testuser', userId: 1 } };
    const loginDto = { username: '', password: 'testpass' };

    await expect(controller.login(req, loginDto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if password is missing', async () => {
    const req = { user: { username: 'testuser', userId: 1 } };
    const loginDto = { username: 'testuser', password: '' };

    await expect(controller.login(req, loginDto)).rejects.toThrow(BadRequestException);
  });

  // it('should throw UnauthorizedException if credentials are incorrect', async () => {
  //   const req = { user: { username: 'wronguser', userId: 1 } };
  //   const loginDto = { username: 'wronguser', password: 'wrongpass' };

  //   jest.spyOn(LocalAuthGuard.prototype, 'canActivate').mockImplementation((context: ExecutionContext) => {
  //     return false;
  //   });

  //   await expect(controller.login(req, loginDto)).rejects.toThrow();
  // });
});
