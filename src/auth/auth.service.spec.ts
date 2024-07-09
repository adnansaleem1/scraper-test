import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  const mockJwtService = {
    sign: jest.fn(() => 'fake-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data when credentials are valid', async () => {
      const result = await service.validateUser('username', 'password');
      expect(result).toEqual({ userId: 1, username: 'username' });
    });

    it('should return null when username is invalid', async () => {
      const result = await service.validateUser('invaliduser', 'password');
      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      const result = await service.validateUser('username', 'invalidpass');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return a JWT token', async () => {
      const user = { userId: 1, username: 'username' };
      const result = await service.login(user);
      expect(result).toEqual({ access_token: 'fake-jwt-token' });
      expect(jwtService.sign).toHaveBeenCalledWith({ username: 'username', sub: 1 });
    });
  });
});
