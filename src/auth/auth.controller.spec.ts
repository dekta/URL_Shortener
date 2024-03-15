import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let authService: AuthService;
  let authController: AuthController;

  const mockUser = {
    _id: '61c0ccf11d7bf83d153d7c06',
    name: 'abc',
    email: 'abc@gmail.com',
  };

  let jwtToken = 'jwtToken';

  const mockAuthService = {
    create: jest.fn().mockResolvedValueOnce(jwtToken),
    signIn: jest.fn().mockResolvedValueOnce(jwtToken),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signUp', () => {
    it('should register a new user', async () => {
      const signUpDto = {
        name: 'abc',
        email: 'abc@gmail.com',
        password: 'abc123',
      };

      const result = await authController.signUp(signUpDto);
      expect(authService.create).toHaveBeenCalled();
     
    });
  });

  describe('signIn', () => {
    it('should login user', async () => {
      const loginDto = {
        email: 'abc@gmail.com',
        password: 'abc123',
      };

      const result = await authController.signIn(loginDto);
      expect(authService.signIn).toHaveBeenCalled();
      expect(result).toEqual(jwtToken);
    });
  });
});